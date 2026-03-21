import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/api.js';
import type { AxiosError } from 'axios';


// 

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

export const useRedeemReward = () => {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, AxiosError<{ error: string }>, void>({
    mutationFn: async () => {
      const res = await api.post('/redemptions');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const usePendingRedemptions = () => {
  return useQuery<any[]>({
    queryKey: ['admin', 'redemptions'],
    queryFn: async () => {
      const res = await api.get('/redemptions/admin/pending');
      return res.data;
    },
    // Refetch every hour
    refetchInterval: 3600000 
  });
};

export const useCompleteRedemption = () => {
  const queryClient = useQueryClient();

  return useMutation<any, AxiosError<{ error: string }>, string>({
    mutationFn: async (id: string) => {
      const res = await api.post(`/redemptions/admin/${id}/complete`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'redemptions'] });
      // Important: Invalidate profile of other users? 
      // We don't have their ID easily here, but we can invalidate all profile queries.
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
