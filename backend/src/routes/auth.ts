import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../db.js';
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
    const { firstName, lastName, phone, dob, email, password, qrId } = req.body;
    
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'Ya existe un usuario registrado con este correo' });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const newUser = await (prisma.user.create({
      data: {
        firstName,
        lastName,
        phone,
        dob: new Date(dob),
        email,
        password: hashedPassword,
        isAdmin: false
      } as Prisma.UserCreateInput
    }) as unknown as Promise<User>);

    // If registered via QR, record the first visit
    if (qrId) {
      await recordVisit(newUser.id, qrId);
    }

    console.log(`User registered: ${newUser.email}, isAdmin: ${newUser.isAdmin}`);
    const token = jwt.sign({ id: newUser.id, isAdmin: !!newUser.isAdmin }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: newUser } as AuthResponse);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Hubo un error al crear tu cuenta';
    console.error('Registration error:', error);
    res.status(500).json({ error: 'No pudimos crear tu cuenta. Por favor, intentá de nuevo.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, qrId } = req.body;

    const user = await (prisma.user.findUnique({ where: { email } }) as Promise<User | null>);
    if (!user || !user.password) {
      return res.status(401).json({ error: 'No encontramos tu usuario' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'La contraseña que ingresaste no es correcta' });
    }

    // If logged in via QR, record the visit
    if (qrId) {
      await recordVisit(user.id, qrId);
    }

    console.log(`User logged in: ${user.email}, isAdmin: ${user.isAdmin}`);
    const token = jwt.sign({ id: user.id, isAdmin: !!user.isAdmin }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user } as AuthResponse);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Hubo un error al iniciar sesión';
    console.error('Login error:', error);
    res.status(500).json({ error: 'No pudimos iniciar sesión. Por favor, intentá de nuevo.' });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { token, phone, dob, qrId } = req.body as GoogleAuthRequest;
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
    
    if (!user) {
      if (!phone || !dob) {
        return res.status(400).json({ requireMoreInfo: true, email: userEmail, firstName: given_name, lastName: family_name });
      }
      user = await (prisma.user.create({
        data: {
          email: userEmail,
          firstName: given_name || '',
          lastName: family_name || '',
          phone,
          dob: new Date(dob),
          isAdmin: false,
        }
      }) as unknown as Promise<User>);
    }

    // If logged in via QR, record the visit
    if (qrId && user) {
      await recordVisit((user as User).id, qrId);
    }
    const jwtToken = jwt.sign({ id: user.id, isAdmin: !!(user as User).isAdmin }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: jwtToken, user: user as User } as AuthResponse);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Hubo un error al entrar con Google';
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'No pudimos entrar con Google. Por favor, intentá de nuevo.' });
  }
});

export default router;
