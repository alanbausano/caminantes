import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

interface QRScannerDialogProps {
  open: boolean;
  onClose: () => void;
  onScanSuccess: (code: string) => void;
}

export default function QRScannerDialog({ open, onClose, onScanSuccess }: QRScannerDialogProps) {
  // Mock logic to simulate a successful scan
  const simulateScan = () => {
    onScanSuccess('mock-restaurant-code-123');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 2, bgcolor: 'background.paper' } }}>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Escaneá el código QR</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2 }}>
        <Box sx={{ 
          width: '100%', 
          height: 250, 
          bgcolor: '#000', 
          borderRadius: 2, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          mb: 3,
          border: '2px solid rgba(255, 193, 7, 0.3)' // Using yellow accent
        }}>
          <QrCodeScannerIcon sx={{ fontSize: 60, color: 'primary.main', opacity: 0.5 }} />
          <Typography variant="caption" sx={{ position: 'absolute', bottom: 50, color: 'text.secondary', opacity: 0.8 }}>
             [ Vista de la Cámara ]
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          Apuntá tu cámara al código QR del local para anotar tu visita.
        </Typography>
        
        {/* TEMPORARY MOCK BUTTON */}
        <Button variant="outlined" color="primary" onClick={simulateScan} sx={{ borderRadius: 2 }}>
           Simular Escaneo Exitoso
        </Button>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3, pt: 0 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
}
