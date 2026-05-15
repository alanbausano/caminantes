import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../db.js';
import { sendWelcomeEmail } from '../services/emailService.js';
import type { User, AuthResponse, GoogleAuthRequest } from '../types/auth.js';
import type { Prisma } from '@prisma/client';

import { recordVisit } from '../services/visitService.js';

const router = express.Router();
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null;
const JWT_SECRET = (process.env.JWT_SECRET || 'dev_secret_only') as string;

if (!googleClientId) {
  console.error('CRITICAL: GOOGLE_CLIENT_ID is not defined in environment variables.');
}

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, dob, email, password, qrId } = req.body;
    
    const userByEmail = await prisma.user.findUnique({ where: { email } });
    if (userByEmail) {
      return res.status(400).json({ error: 'Ya existe un usuario registrado con este correo', field: 'email' });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const newUser = await (prisma.user.create({
      data: {
        firstName,
        lastName,
        dob: new Date(dob),
        email,
        password: hashedPassword,
        isAdmin: false
      } as Prisma.UserCreateInput
    }) as unknown as Promise<User>);

    // WELCOME VISIT: Every newly registered user gets 1 free visit loaded instantly!
    await prisma.visit.create({ data: { userId: newUser.id } });

    // If registered via QR, record the first visit
    if (qrId) {
      await recordVisit(newUser.id, qrId);
    }

    if (email) {
      const verificationToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await prisma.verificationToken.create({
        data: {
          token: verificationToken,
          userId: newUser.id,
          expiresAt
        }
      });

      // Asynchronous non-blocking dispatch
      sendWelcomeEmail(email, firstName, verificationToken).catch(console.error);
    }

    const token = jwt.sign({ id: newUser.id, isAdmin: !!newUser.isAdmin }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: newUser } as AuthResponse);
  } catch (error: unknown) {
    console.error('[Auth] Registration error:', error);
    res.status(500).json({ error: 'No pudimos crear tu cuenta. Por favor, intentá de nuevo.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, qrId } = req.body;

    const user = await (prisma.user.findUnique({ where: { email } }) as Promise<User | null>);
    if (!user || !user.password) {
      return res.status(401).json({ error: 'No encontramos tu usuario', field: 'email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'La contraseña es incorrecta', field: 'password' });
    }

    // If logged in via QR, record the visit
    if (qrId) {
      await recordVisit(user.id, qrId);
    }

    const token = jwt.sign({ id: user.id, isAdmin: !!user.isAdmin }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user } as AuthResponse);
  } catch (error: unknown) {
    console.error('[Auth] Login error:', error);
    res.status(500).json({ error: 'No pudimos iniciar sesión. Por favor, intentá de nuevo.' });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { token, dob, qrId } = req.body as GoogleAuthRequest;
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error('GOOGLE_CLIENT_ID is not set in environment');
    }

    if (!googleClient) {
      throw new Error('Google OAuth client is not initialized');
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: googleClientId!,
    });
    
    if (!ticket) return res.status(400).json({ error: 'No pudimos verificar el token de Google' });
    
    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ error: 'El servicio de Google devolvió un error' });
    
    const { email, given_name, family_name } = payload;
    if (!email) {
      return res.status(400).json({ error: 'Tu cuenta de Google no tiene un correo asociado' });
    }
    
    const userEmail = email as string;
    let user: User | null = await (prisma.user.findUnique({ where: { email: userEmail } }) as Promise<User | null>);
    
    // NEW USER via Google
    if (!user) {
      if (!dob) {
        return res.status(400).json({ requireMoreInfo: true, email: userEmail, firstName: given_name, lastName: family_name });
      }
      user = await (prisma.user.create({
        data: {
          email: userEmail,
          firstName: given_name || '',
          lastName: family_name || '',
          dob: new Date(dob),
          isAdmin: false,
          isEmailVerified: true // Google emails are pre-verified
        }
      }) as unknown as Promise<User>);

      // WELCOME VISIT
      await prisma.visit.create({ data: { userId: user.id } });
      
      // SEND WELCOME EMAIL (onboarding info)
      sendWelcomeEmail(userEmail, user.firstName, 'google-verified').catch(console.error);
    }

    // If logged in via QR, record the visit
    if (qrId && user) {
      await recordVisit((user as User).id, qrId);
    }
    
    const jwtToken = jwt.sign({ id: user.id, isAdmin: !!(user as User).isAdmin }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: jwtToken, user: user as User } as AuthResponse);
  } catch (error: unknown) {
    console.error('[Auth] Google auth error:', error);
    res.status(500).json({ error: 'No pudimos entrar con Google. Por favor, intentá de nuevo.' });
  }
});

// GET /verify-email
router.get('/verify-email', async (req, res) => {
  const token = req.query.token as string;
  if (!token) return res.status(400).json({ error: 'Token no proporcionado' });

  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!verificationToken) return res.status(400).json({ error: 'Token inválido o cuenta ya verificada.' });

    if (verificationToken.expiresAt < new Date()) {
      return res.status(400).json({ error: 'El link expiró. Por favor solicitá uno nuevo.' });
    }

    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { isEmailVerified: true }
    });

    await prisma.verificationToken.delete({ where: { id: verificationToken.id } });

    res.json({ message: 'Correo verificado con éxito' });
  } catch (error) {
    console.error('Email verify error:', error);
    res.status(500).json({ error: 'Error del servidor al verificar correo' });
  }
});

export default router;
