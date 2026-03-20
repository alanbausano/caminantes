import { useState, useEffect } from 'react';
import QRCodeLib from 'react-qr-code';
import { Container, Box, Typography, Paper, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

// Handle commonjs interop for Vite/NodeNext
const QRCode = (QRCodeLib as unknown as { default?: typeof QRCodeLib }).default || QRCodeLib;

export default function AdminDashboardPage() {
  const [token, setToken] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30); // 30 seconds refresh cycle

  // Simplified polling logic to generate a new scan token every 30 seconds
  useEffect(() => {
    const generateToken = () => {
      const newToken = `loscami-visit-${Math.random().toString(36).substring(2, 10)}-${Date.now()}`;
      setToken(newToken);
      setTimeLeft(30);
    };

    // Generate initial token
    generateToken();

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          generateToken();
          return 30; // reset
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper 
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        elevation={24}
        sx={{ 
          p: 6, 
          borderRadius: 4, 
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          maxWidth: 500
        }}
      >
        <Typography variant="h3" color="primary" gutterBottom sx={{ fontWeight: 800 }}>
          Scanner Los Caminantes
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Escaneá este código para sumar tu visita.
        </Typography>

        <Box sx={{ 
          bgcolor: 'white', 
          p: 2, 
          borderRadius: 4, 
          mb: 4,
          boxShadow: '0px 10px 30px rgba(0,0,0,0.5)'
        }}>
          {token ? (
            <QRCode value={`${window.location.origin}/scan/${token}`} size={250} />
          ) : (
            <Box sx={{ width: 250, height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress color="primary" />
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress 
            variant="determinate" 
            value={(timeLeft / 30) * 100} 
            size={24}
            thickness={5}
            color={timeLeft <= 5 ? 'error' : 'primary'}
          />
          <Typography variant="body2" color={timeLeft <= 5 ? 'error.main' : 'text.secondary'} sx={{ fontWeight: 'bold' }}>
            El código se actualiza en {timeLeft}s
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
