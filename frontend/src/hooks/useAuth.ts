import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../api/api.js';

import type { AxiosError } from 'axios';
import type { RegisterData, LoginData, AuthResponse, User } from '../types/auth';

export const useRegister = () => {
  return useMutation<AuthResponse, AxiosError<{ error: string }>, RegisterData>({
    mutationFn: async (data: RegisterData): Promise<AuthResponse> => {
      const res = await api.post('/auth/register', data);
      return res.data;
    },
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
  });
};

export const useLogin = () => {
  return useMutation<AuthResponse, AxiosError<{ error: string }>, LoginData>({
    mutationFn: async (data: LoginData): Promise<AuthResponse> => {
      const res = await api.post('/auth/login', data);
      return res.data;
    },
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
  });
};

export const useProfile = () => {
  return useQuery<User, AxiosError<{ error: string }>>({
    queryKey: ['profile'],
    queryFn: async (): Promise<User> => {
      try {
        const res = await api.get('/visits/profile');
        return res.data;
      } catch (error) {
        // If profile fetch fails, clear local session to stop infinite loops
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw error;
      }
    },
    retry: false,
  });
};
