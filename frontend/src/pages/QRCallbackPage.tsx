import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Container, Box, CircularProgress } from '@mui/material';
import { useToast } from '../context/ToastContext';
import { useScanVisit } from '../hooks/useVisits';
import type { AxiosError } from 'axios';

export default function QRCallbackPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const scanMutation = useScanVisit();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (id) {
      if (!token) {
        // Redirect to landing page with the QR ID to handle it after login/register
        showToast('¡Ingresá para registrar tu visita!', 'info');
        navigate(`/?qrId=${id}`, { replace: true });
        return;
      }

      scanMutation.mutate(id, {
        onSuccess: () => {
          showToast('Registramos tu visita con éxito!', 'success');
          navigate('/dashboard', { replace: true });
        },
        onError: (error: AxiosError<{ error: string }>) => {
          showToast(error.response?.data?.error || 'Hubo un error al validar el código', 'error');
          navigate('/dashboard', { replace: true });
        }
      });
    }
  }, [id, navigate, scanMutation, showToast]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 15, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CircularProgress color="primary" size={60} thickness={4} />
        <Typography variant="h5" color="text.primary" sx={{ mt: 4 }}>
          Procesando tu visita...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Código: {id}
        </Typography>
      </Box>
    </Container>
  );
}
