import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Box, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import api from '../api/api'; 
import { useToast } from '../context/ToastContext';
import { useQueryClient } from '@tanstack/react-query';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Vínculo inválido. No se encontró el token de verificación de seguridad.');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await api.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(response.data.message || '¡Tu correo electrónico fue verificado con éxito!');
        showToast('Cuenta verificada correctamente', 'success');
        
        // Invalidate profile cache so Dashboard updates the banner instantly
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.error || 'No pudimos verificar tu correo de acceso.');
      }
    };

    verifyToken();
  }, [token, showToast, queryClient]);

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 6 }}>
      {status === 'loading' && (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6">Autenticando tu cuenta de forma segura...</Typography>
        </Box>
      )}

      {status === 'success' && (
        <Box sx={{ textAlign: 'center' }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 90, mb: 3 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>¡Todo listo!</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 5, fontSize: '1.2rem' }}>
            {message}
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate('/dashboard')} sx={{ borderRadius: 2, px: 5, fontSize: '1.1rem', py: 1.5 }}>
            Entrar a la App
          </Button>
        </Box>
      )}

      {status === 'error' && (
        <Box sx={{ textAlign: 'center' }}>
          <ErrorOutlineIcon color="error" sx={{ fontSize: 90, mb: 3 }} />
          <Typography variant="h4" gutterBottom color="error" sx={{ fontWeight: 'bold' }}>Hubo un problema</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 5, fontSize: '1.2rem' }}>
            {message}
          </Typography>
          <Button variant="outlined" size="large" onClick={() => navigate('/')} sx={{ borderRadius: 2, px: 5, fontSize: '1.1rem', py: 1.5 }}>
            Volver al Inicio
          </Button>
        </Box>
      )}
    </Container>
  );
}
