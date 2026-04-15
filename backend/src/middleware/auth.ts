import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import type { User } from '../types/auth.js';

export interface AuthRequest extends Request {
  user?: User | { id: string };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No tenés autorización. Por favor, iniciá sesión.' });

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Tu sesión expiró o el token no es válido.' });
    req.user = decoded as User | { id: string };
    next();
  });
};
