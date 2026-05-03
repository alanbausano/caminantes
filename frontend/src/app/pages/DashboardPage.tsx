import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, Container, Box, Paper, Button, CircularProgress, 
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Alert, AlertTitle
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import RedeemsIcon from '@mui/icons-material/CardGiftcard';
import CouponTracker from '../components/Loyalty/CouponTracker';
import QRScannerDialog from '../components/Scanner/QRScannerDialog';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import { useToast } from '../context/ToastContext';
import { useScanVisit, useRedeemReward } from '../hooks/useVisits';
import { useProfile } from '../hooks/useAuth';
import type { AxiosError } from 'axios';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: userData, isLoading } = useProfile();
  const scanMutation = useScanVisit();
  const redeemMutation = useRedeemReward();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [isProcessingScan, setIsProcessingScan] = useState(false);
  const { showToast } = useToast();
  const targetVisits = 10;

  const handleScanSuccess = useCallback((code: string) => {
    console.log("QR Scan detected raw code:", code);
    
    // Extract ID if it's a URL (e.g., http://domain.com/scan/ID)
    let finalCode = code;
    if (code.includes('/scan/')) {
      const parts = code.split('/scan/');
      finalCode = parts[parts.length - 1].split(/[?#]/)[0]; // Get ID and strip query/hash
      console.log("Extracted ID from URL:", finalCode);
    }

    setIsProcessingScan(true);
    
    scanMutation.mutate(finalCode, {
      onSuccess: (data) => {
        console.log("Scan request success:", data);
        showToast('¡Anotamos tu visita con éxito!', 'success');
        setScannerOpen(false);
        setIsProcessingScan(false);
      },
      onError: (error) => {
        const axiosError = error as AxiosError<{ error: string }>;
        console.error("Scan request error:", axiosError.response?.data || axiosError.message);
        showToast(axiosError.response?.data?.error || 'Hubo un error al anotar tu visita', 'error');
        setScannerOpen(false);
        setIsProcessingScan(false);
      }
    });
  }, [scanMutation, showToast]);

  const handleRedeem = () => {
    redeemMutation.mutate(undefined, {
      onSuccess: () => {
        setRedeemOpen(false);
        showToast('¡Pedido de canje enviado! Avisale al cajero.', 'success');
      },
      onError: (error) => {
        const axiosError = error as AxiosError<{ error: string }>;
        showToast(axiosError.response?.data?.error || 'Hubo un error al pedir el canje', 'error');
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
  const canRedeem = visitsCount >= targetVisits;
  const hasPendingRedemption = userData?.redemptions?.some((r: any) => r.status === 'PENDING') || false;

  return (
    <Container maxWidth="sm" sx={{ 
      py: { xs: 1.5, sm: 4 }, 
      display: 'flex', 
      flexDirection: 'column', 
      flex: 1,
      height: '100vh',
      gap: { xs: 1, sm: 2 }
    }}>
      {!isLoading && userData && !userData.isEmailVerified && (
        <Box 
          component={motion.div}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.5 }}
        >
          <Alert severity="warning" sx={{ mb: 1, borderRadius: 2, alignItems: 'center' }}>
            <AlertTitle sx={{ fontWeight: 'bold', mb: 0 }}>¡Revisá tu correo!</AlertTitle>
            Te enviamos un link para activar tu cuenta. Revisá correo no deseado (SPAM) si no lo ves.
          </Alert>
        </Box>
      )}

      {/* Header Box */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
      >
        <Box
          component={motion.div}
          animate={{ scale: [1, 1.05, 1] }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: 'white',
            border: '3px solid #FFC107',
            boxShadow: '0 0 16px rgba(255, 193, 7, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 0.75,
            flexShrink: 0,
            cursor: 'pointer'
          }}
        >
          <Box component="img" src={logo} alt="Logo" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </Box>
        <Box>
          <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', sm: '2.125rem' }, mb: 0 }}>
            ¡Hola, {firstName}! 👋
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            ¿Estás para otra hamburguesa?
          </Typography>
        </Box>
      </Box>

      <Paper 
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        elevation={24} 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          borderRadius: 2, 
          bgcolor: 'background.paper',
          flexShrink: 0,
          mt: 5
        }}
      >
        <CouponTracker visits={visitsCount} targetVisits={targetVisits} />
      </Paper>

      <Box 
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}
      >
        <AnimatePresence>
          {canRedeem && (
            <Box
              component={motion.div}
              initial={{ opacity: 0, height: 0, scale: 0.9 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.9 }}
              sx={{ overflow: 'hidden' }}
            >
              <Button
                fullWidth
                variant="contained"
                disabled={hasPendingRedemption}
                size="large"
                startIcon={<RedeemsIcon />}
                onClick={() => setRedeemOpen(true)}
                sx={{
                  py: { xs: 1.5, sm: 2 },
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  bgcolor: hasPendingRedemption ? '#A17A00' : '#FFC107',
                  color: hasPendingRedemption ? 'rgba(255, 255, 255, 0.9)' : '#1A1A1A',
                  '&:hover': { bgcolor: hasPendingRedemption ? '#A17A00' : '#FFD54F' },
                  '&.Mui-disabled': {
                    bgcolor: '#A17A00',
                    color: 'rgba(255, 255, 255, 0.9)'
                  },
                  borderRadius: 2,
                  boxShadow: hasPendingRedemption ? 'none' : '0 0 20px rgba(255, 193, 7, 0.4)',
                  animation: hasPendingRedemption ? 'none' : 'pulse 2s infinite'
                }}
              >
                {hasPendingRedemption ? 'Canje Solicitado' : '¡Canjear Hamburguesa Gratis!'}
              </Button>
            </Box>
          )}
        </AnimatePresence>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          startIcon={<QrCodeScannerIcon />}
          onClick={() => setScannerOpen(true)}
          sx={{
            py: { xs: 1.5, sm: 2 },
            fontSize: '1.1rem',
            color: '#1A1A1A',
            borderRadius: 2
          }}
        >
          Escaneá el código
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={redeemOpen}
        onClose={() => !redeemMutation.isPending && setRedeemOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>¿Canjeamos tu hamburguesa gratis?</DialogTitle>
        <DialogContent>
          <DialogContentText textAlign="center">
            Estás por pedir tu hamburguesa gratis. <br/>
            <strong>Avisá en caja para que lo procesen.</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', px: 3, pb: 2, gap: 1 }}>
          <Button 
            onClick={() => setRedeemOpen(false)} 
            disabled={redeemMutation.isPending}
            sx={{ fontWeight: 'bold' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleRedeem} 
            variant="contained" 
            disabled={redeemMutation.isPending}
            sx={{ borderRadius: 2, px: 3, fontWeight: 'bold', color: '#1A1A1A' }}
          >
            {redeemMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>

      <QRScannerDialog 
        open={scannerOpen} 
        onClose={() => setScannerOpen(false)} 
        onScanSuccess={handleScanSuccess}
        isProcessing={isProcessingScan}
      />

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Container>
  );
}
