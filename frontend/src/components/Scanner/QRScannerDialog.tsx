import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Alert } from '@mui/material';
import { BrowserQRCodeReader } from '@zxing/library';

interface QRScannerDialogProps {
  open: boolean;
  onClose: () => void;
  onScanSuccess: (code: string) => void;
}

export default function QRScannerDialog({ open, onClose, onScanSuccess }: QRScannerDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef(new BrowserQRCodeReader());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let controls: any = null;

    const startScanner = async () => {
      if (open && videoRef.current) {
        try {
          setError(null);
          
          // Using constraints is more reliable for mobile browsers to pick the back camera
          const constraints: MediaStreamConstraints = {
            video: { facingMode: 'environment' }
          };

          const ctrl = await codeReader.current.decodeFromConstraints(constraints, videoRef.current, (result) => {
            if (result) {
              onScanSuccess(result.getText());
            }
          });
          controls = ctrl;
        } catch (e) {
          console.error('Camera error with constraints:', e);
          try {
            // Fallback to default device if constraints fail
            const ctrl = await codeReader.current.decodeFromVideoDevice(null, videoRef.current, (result) => {
              if (result) {
                onScanSuccess(result.getText());
              }
            });
            controls = ctrl;
          } catch (fallbackError) {
            console.error('Fallback camera error:', fallbackError);
            setError('No pudimos acceder a la cámara. Verificá los permisos de tu navegador y que estés usando HTTPS.');
          }
        }
      }
    };

    startScanner();

    return () => {
      if (controls) {
        // Some versions of ZXing need explicit stop via controls or reset
      }
      codeReader.current.reset();
    };
  }, [open, onScanSuccess]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="xs" 
      PaperProps={{ sx: { borderRadius: 3, bgcolor: 'background.paper', overflow: 'hidden' } }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', pt: 3 }}>Escaneá el código QR</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 1 }}>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%', borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ 
          width: '100%', 
          aspectRatio: '1/1',
          maxHeight: 300,
          bgcolor: '#000', 
          borderRadius: 3, 
          position: 'relative',
          overflow: 'hidden',
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          mb: 2,
          border: '2px solid',
          borderColor: 'primary.main',
          boxShadow: '0 0 20px rgba(255, 193, 7, 0.2)'
        }}>
          <video 
            ref={videoRef} 
            playsInline
            muted
            autoPlay
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          
          {/* Scanning frame overlay */}
          <Box sx={{
            position: 'absolute',
            width: '70%',
            height: '70%',
            border: '2px solid rgba(255, 255, 255, 0.5)',
            borderRadius: 2,
            pointerEvents: 'none',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              bgcolor: 'primary.main',
              boxShadow: '0 0 10px #FFC107',
              animation: 'scan 2s infinite ease-in-out',
            },
            '@keyframes scan': {
              '0%': { transform: 'translateY(0)' },
              '100%': { transform: 'translateY(210px)' }
            }
          }} />
        </Box>

        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ px: 2 }}>
          Apuntá tu cámara al código QR del local para anotar tu visita.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
        <Button 
          onClick={onClose} 
          fullWidth
          variant="outlined"
          color="inherit" 
          sx={{ borderRadius: 2, py: 1, fontWeight: 'bold' }}
        >
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
