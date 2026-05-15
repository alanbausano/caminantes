import { useState, useEffect } from 'react';
import QRCodeLib from 'react-qr-code';
import {
  Container, Box, Typography, Paper, CircularProgress,
  Tabs, Tab, List, ListItem, ListItemText, Divider, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import RefreshIcon from '@mui/icons-material/Refresh';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';
import { usePendingRedemptions, useCompleteRedemption, useCompletedRedemptions } from '../hooks/useVisits';
import { useToast } from '../context/ToastContext';

// Handle commonjs interop for Vite/NodeNext
const QRCode = (QRCodeLib as unknown as { default?: typeof QRCodeLib }).default || QRCodeLib;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
      style={{ display: value === index ? 'block' : 'none', flex: 1 }}
    >
      {value === index && (
        <Box sx={{ py: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [tabValue, setTabValue] = useState(0);
  const [token, setToken] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30);

  // Confirm Dialog State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedRedemption, setSelectedRedemption] = useState<{ id: string, name: string } | null>(null);

  const { data: redemptions, isLoading: redemptionsLoading, refetch, isRefetching } = usePendingRedemptions();
  const { data: completedRedemptions, isLoading: completedLoading, refetch: refetchCompleted, isRefetching: isCompletedRefetching } = useCompletedRedemptions();

  const completeMutation = useCompleteRedemption();
  const { showToast } = useToast();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // QR Logic
  useEffect(() => {
    const generateToken = () => {
      const newToken = `loscami-visit-${Math.random().toString(36).substring(2, 10)}-${Date.now()}`;
      setToken(newToken);
      setTimeLeft(30);
    };
    generateToken();
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          generateToken();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = () => {
    refetch();
    refetchCompleted();
  };

  const initiateComplete = (id: string, userName: string) => {
    setSelectedRedemption({ id, name: userName });
    setConfirmOpen(true);
  };

  const confirmComplete = () => {
    if (!selectedRedemption) return;
    completeMutation.mutate(selectedRedemption.id, {
      onSuccess: () => {
        showToast(`¡Canje de ${selectedRedemption.name} completado!`, 'success');
        setConfirmOpen(false);
        setSelectedRedemption(null);
        refetchCompleted(); // Update the history list
      },
      onError: (error: any) => {
        showToast(error.response?.data?.error || 'Error al completar el canje', 'error');
        setConfirmOpen(false);
        setSelectedRedemption(null);
      }
    });
  };

  return (
    <Container maxWidth="md" sx={{ minHeight: '100vh', py: 4, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>
          Panel de Administración
        </Typography>
      </Box>

      <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<QrCodeScannerIcon />} label="Scanner" />
          <Tab icon={<AssignmentIcon />} label={`Pedidos (${redemptions?.length || 0})`} />
        </Tabs>

        <Box sx={{ px: { xs: 2, md: 4 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* TAB 0: SCANNER */}
          <CustomTabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 2 }}>
              <Box
                component={motion.div}
                animate={{ rotate: [0, 2, -2, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                sx={{
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  bgcolor: 'white',
                  border: '5px solid #FFC107',
                  boxShadow: '0 0 40px rgba(255, 193, 7, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 1.5,
                  mb: 3,
                }}
              >
                <Box component="img" src={logo} alt="Logo" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </Box>

              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                Código de Visita
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Mostrá este código para que los clientes sumen visitas.
              </Typography>

              <Box sx={{
                bgcolor: 'white',
                p: 2,
                borderRadius: 4,
                mb: 4,
                boxShadow: '0px 10px 30px rgba(0,0,0,0.1)'
              }}>
                {token ? (
                  <QRCode value={`${window.location.origin}/app/scan/${token}`} size={200} />
                ) : (
                  <Box sx={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
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
                  Se actualiza en {timeLeft}s
                </Typography>
              </Box>
            </Box>
          </CustomTabPanel>

          {/* TAB 1: REQUESTS */}
          <CustomTabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Canjes Pendientes
              </Typography>
              <IconButton onClick={handleRefresh} disabled={isRefetching || isCompletedRefetching}>
                {(isRefetching || isCompletedRefetching) ? <CircularProgress size={24} /> : <RefreshIcon color="primary" />}
              </IconButton>
            </Box>

            {redemptionsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                <AnimatePresence initial={false}>
                  {redemptions && redemptions.length > 0 ? (
                    redemptions.map((red, index) => (
                      <Box
                        key={red.id}
                        component={motion.div}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ListItem
                          sx={{
                            px: 0, py: 2,
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            gap: 2
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                {red.user.firstName} {red.user.lastName}
                              </Typography>
                            }
                            secondary={
                              <Box component="span" sx={{ display: 'block' }}>
                                <Typography variant="body2">{red.user.phone}</Typography>
                                <Typography variant="caption" color="text.disabled">
                                  Hace {Math.floor((Date.now() - new Date(red.createdAt).getTime()) / 60000)} min
                                </Typography>
                              </Box>
                            }
                          />
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckCircleOutlineIcon />}
                            onClick={() => initiateComplete(red.id, red.user.firstName)}
                            disabled={completeMutation.isPending}
                            sx={{ borderRadius: 2, fontWeight: 'bold', ml: { sm: 'auto' } }}
                          >
                            Marcar como Entregado
                          </Button>
                        </ListItem>
                        {index < redemptions.length - 1 && <Divider />}
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ py: 6, textAlign: 'center' }}>
                      <Typography color="text.secondary">No hay pedidos pendientes. ✨</Typography>
                    </Box>
                  )}
                </AnimatePresence>
              </List>
            )}

            {/* HISTORIAL (COMPLETED) */}
            <Box sx={{ mt: 5, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <HistoryIcon color="action" />
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Historial de Entregados
              </Typography>
            </Box>

            {completedLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {completedRedemptions && completedRedemptions.length > 0 ? (
                  completedRedemptions.map((red, index) => (
                    <Box key={red.id}>
                      <ListItem
                        sx={{
                          px: 2, py: 1.5,
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { xs: 'flex-start', sm: 'center' },
                          gap: 2,
                          bgcolor: 'rgba(0,0,0,0.02)',
                          borderRadius: 2,
                          mb: index < completedRedemptions.length - 1 ? 1 : 0
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                              {red.user.firstName} {red.user.lastName}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.disabled">
                              Entregado el {new Date(red.processedAt).toLocaleDateString()} a las {new Date(red.processedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          }
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: { sm: 'auto' } }}>
                          <TaskAltIcon color="success" fontSize="small" />
                          <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>Entregado</Typography>
                        </Box>
                      </ListItem>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography color="text.disabled">No hay pedidos entregados aún.</Typography>
                  </Box>
                )}
              </List>
            )}
          </CustomTabPanel>
        </Box>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => !completeMutation.isPending && setConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Confirmar Entrega
        </DialogTitle>
        <DialogContent>
          <DialogContentText textAlign="center">
            ¿Confirmás que le entregaste la hamburguesa gratis a <strong>{selectedRedemption?.name}</strong>? <br /><br />
            Esta acción no se puede deshacer y reseteará sus visitas.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            disabled={completeMutation.isPending}
            sx={{ fontWeight: 'bold', color: 'text.secondary' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmComplete}
            variant="contained"
            color="success"
            disabled={completeMutation.isPending}
            sx={{ borderRadius: 2, px: 3, fontWeight: 'bold' }}
          >
            {completeMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Sí, entregado'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
