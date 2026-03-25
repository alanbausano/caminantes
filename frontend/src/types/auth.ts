export interface Visit {
  id: string;
  userId: string;
  timestamp: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  dob: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  visits?: Visit[];
  redemptions?: { id: string, status: string, createdAt: string, processedAt?: string | null }[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  password?: string;
  qrId?: string;
}

export interface LoginData {
  email: string;
  password?: string;
  qrId?: string;
}
