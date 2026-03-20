export interface Visit {
  id: string;
  userId: string;
  timestamp: string;
}

export interface Coupon {
  id: string;
  userId: string;
  earnedAt: string;
  isRedeemed: boolean;
  redeemedAt: string | null;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  dob: string;
  createdAt: string;
  updatedAt: string;
  visits?: Visit[];
  coupons?: Coupon[];
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
