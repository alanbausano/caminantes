import type { User as PrismaUser } from '@prisma/client';

export interface User extends Omit<PrismaUser, 'password'> {
  password?: string | null;
  isAdmin: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface GoogleAuthRequest {
  token: string;

  dob?: string;
  qrId?: string;
}
