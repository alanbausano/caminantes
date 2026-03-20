import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../db.js';
import type { User, AuthResponse, GoogleAuthRequest } from '../types/auth.js';
import type { Prisma } from '@prisma/client';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, phone, dob, email, password } = req.body;
    
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
        password: hashedPassword
      } as Prisma.UserCreateInput
    }) as unknown as Promise<User>);

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: newUser } as AuthResponse);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Hubo un error al crear tu cuenta';
    console.error('Registration error:', error);
    res.status(500).json({ error: 'No pudimos crear tu cuenta. Por favor, intentá de nuevo.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await (prisma.user.findUnique({ where: { email } }) as Promise<User | null>);
    if (!user || !user.password) {
      return res.status(401).json({ error: 'No encontramos tu usuario o tal vez tengas que entrar con Google' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'La contraseña que ingresaste no es correcta' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user } as AuthResponse);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Hubo un error al iniciar sesión';
    console.error('Login error:', error);
    res.status(500).json({ error: 'No pudimos iniciar sesión. Por favor, intentá de nuevo.' });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { token, phone, dob } = req.body as GoogleAuthRequest;
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error('GOOGLE_CLIENT_ID is not set in environment');
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    if (!ticket) return res.status(400).json({ error: 'No pudimos verificar el token de Google' });
    
    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ error: 'El servicio de Google devolvió un error' });
    
    const { email, given_name, family_name } = payload;
    if (!email) {
      return res.status(400).json({ error: 'Tu cuenta de Google no tiene un correo asociado' });
    }
    
    const userEmail = email as string;
    
    let user: User | null = await prisma.user.findUnique({ where: { email: userEmail } });
    
    if (!user) {
      if (!phone || !dob) {
        return res.status(400).json({ requireMoreInfo: true, email: userEmail, firstName: given_name, lastName: family_name });
      }
      user = await prisma.user.create({
        data: {
          email: userEmail,
          firstName: given_name || '',
          lastName: family_name || '',
          phone,
          dob: new Date(dob),
        }
      });
    }

    const jwtToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: jwtToken, user } as AuthResponse);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Hubo un error al entrar con Google';
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'No pudimos entrar con Google. Por favor, intentá de nuevo.' });
  }
});

export default router;
