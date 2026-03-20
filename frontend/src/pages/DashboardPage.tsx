import { useState } from 'react';
import { Typography, Container, Box, Paper, Button, CircularProgress } from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CouponTracker from '../components/Loyalty/CouponTracker';
import QRScannerDialog from '../components/Scanner/QRScannerDialog';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { useProfile, useScanVisit } from '../hooks/useVisits';
import type { AxiosError } from 'axios';

export default function DashboardPage() {
  const { data: userData, isLoading } = useProfile();
  const scanMutation = useScanVisit();
  const [scannerOpen, setScannerOpen] = useState(false);
  const { showToast } = useToast();
  const targetVisits = 10;

  const handleScanSuccess = async (code: string) => {
    console.log("Scanned code:", code);
    setScannerOpen(false);
    
    scanMutation.mutate(code, {
      onSuccess: () => {
        showToast('¡Anotamos tu visita con éxito!', 'success');
      },
      onError: (error) => {
        const axiosError = error as AxiosError<{ error: string }>;
        showToast(axiosError.response?.data?.error || 'Hubo un error al anotar tu visita', 'error');
      }
    });
  };

  if (isLoading && !userData) {
    return (
      <Container maxWidth="sm" sx={{ pt: 10, textAlign: 'center' }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Container>
    );
  }

  const visitsCount = userData?.visits?.length || 0;
  const firstName = userData?.firstName || 'Invitado';

  return (
    <Container maxWidth="sm" sx={{ pt: 4, pb: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box 
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{ mb: 4 }}
      >
        <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 800 }}>
          ¡Hola, {firstName}! 👋
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          ¿Estás listo para otra burger?
        </Typography>
      </Box>

      <Paper 
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        elevation={24} 
        sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}
      >
        <CouponTracker visits={visitsCount} targetVisits={targetVisits} />
      </Paper>

      <Box 
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        sx={{ mt: 'auto', mb: 2 }}
      >
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          startIcon={<QrCodeScannerIcon />}
          onClick={() => setScannerOpen(true)}
          sx={{
            py: 2,
            fontSize: '1.1rem',
            color: '#1A1A1A'
          }}
        >
          Escaneá el código
        </Button>
      </Box>

      <QRScannerDialog 
        open={scannerOpen} 
        onClose={() => setScannerOpen(false)} 
        onScanSuccess={handleScanSuccess}
      />
    </Container>
  );
}
