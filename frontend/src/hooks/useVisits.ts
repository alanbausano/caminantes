import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/api.js';
import type { User } from '../types/auth';
import type { AxiosError } from 'axios';

export const useProfile = () => {
  return useQuery<User>({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/visits/me');
      return res.data;
    },
  });
};

export const useScanVisit = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean }, AxiosError<{ error: string }>, string>({
    mutationFn: async (code: string) => {
      const res = await api.post('/visits/scan', { code });
      return res.data;
    },
    onSuccess: () => {
      // Invalidate profile to refetch new visit count
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
