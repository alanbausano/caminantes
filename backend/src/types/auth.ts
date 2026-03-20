import type { User as PrismaUser } from '@prisma/client';

export interface User extends PrismaUser {
  password?: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface GoogleAuthRequest {
  token: string;
  phone?: string;
  dob?: string;
}
