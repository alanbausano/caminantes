import { useEffect, useRef, useState, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Alert, CircularProgress } from '@mui/material';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerDialogProps {
  open: boolean;
  onClose: () => void;
  onScanSuccess: (code: string) => void;
  isProcessing?: boolean;
}

export default function QRScannerDialog({ open, onClose, onScanSuccess, isProcessing = false }: QRScannerDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasScannedRef = useRef(false);
  
  const scanCallbackRef = useRef(onScanSuccess);
  useEffect(() => {
    scanCallbackRef.current = onScanSuccess;
  }, [onScanSuccess]);

  const isProcessingRef = useRef(isProcessing);
  useEffect(() => {
    isProcessingRef.current = isProcessing;
  }, [isProcessing]);

  const handleScanOnce = useCallback((code: string) => {
    if (hasScannedRef.current || isProcessingRef.current) return;
    hasScannedRef.current = true;
    console.log("QR detected, triggering callback:", code);
    scanCallbackRef.current(code);
  }, []);

  useEffect(() => {
    if (!open) return;

    hasScannedRef.current = false;
    setError(null);
    let html5QrCode: Html5Qrcode | null = null;
    let isComponentMounted = true;

    const startCamera = async () => {
      try {
        html5QrCode = new Html5Qrcode("qr-reader");
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (isComponentMounted) {
               handleScanOnce(decodedText);
            }
          },
          () => {
            // Ignore parse errors (happen on every frame with no QR code)
          }
        );
      } catch (err: any) {
        console.error('Camera permission/start error:', err);
        if (!isComponentMounted) return;
        const errMsg = typeof err === 'string' ? err : err?.message || '';
        
        if (errMsg.includes("NotAllowedError") || errMsg.includes("Permission denied")) {
          setError('Permiso de cámara denegado. Habilitá el acceso en la configuración de tu navegador.');
        } else if (errMsg.includes("NotFoundError") || errMsg.includes("Requested device not found")) {
          setError('No se encontró ninguna cámara en este dispositivo.');
        } else {
          setError('No pudimos acceder a la cámara. Verificá los permisos y la conexión.');
        }
      }
    };

    // Need a small timeout to let the modal Dialog render the div into the DOM
    const timer = setTimeout(() => {
       if (isComponentMounted) {
           startCamera();
       }
    }, 100);

    return () => {
      isComponentMounted = false;
      clearTimeout(timer);
      if (html5QrCode && html5QrCode.isScanning) {
        // html5-qrcode stop() returns a promise and is asynchronous
        html5QrCode.stop().then(() => {
          html5QrCode?.clear();
        }).catch(err => console.error("Error stopping scanner", err));
      } else if (html5QrCode) {
        html5QrCode.clear();
      }
    };
  }, [open, handleScanOnce]);

  return (
    <Dialog 
      open={open} 
      onClose={isProcessing ? undefined : onClose} 
      fullWidth 
      maxWidth="xs" 
      PaperProps={{ sx: { borderRadius: 3, bgcolor: 'background.paper', overflow: 'hidden' } }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', pt: 3 }}>Escaneá el código QR</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 1, px: 2 }}>
        
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
          boxShadow: '0 0 20px rgba(255, 193, 7, 0.2)',
          '& video': {
            objectFit: 'cover !important',
            width: '100% !important',
            height: '100% !important'
          }
        }}>
          <div 
             id="qr-reader" 
             style={{ 
               width: '100%', 
               height: '100%',
               display: isProcessing ? 'none' : 'block' // hide video wrapper if processing
             }}
          />
          
          {isProcessing && (
            <Box sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(26, 26, 26, 0.8)',
              zIndex: 10,
              backdropFilter: 'blur(4px)'
            }}>
              <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                Procesando...
              </Typography>
            </Box>
          )}

          {/* Scanning frame overlay */}
          {!isProcessing && !error && (
            <Box sx={{
              position: 'absolute',
              width: '70%',
              height: '70%',
              border: '2px solid rgba(255, 255, 255, 0.5)',
              borderRadius: 2,
              pointerEvents: 'none',
              zIndex: 5,
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                bgcolor: 'primary.main',
                boxShadow: '0 0 10px #FFC107',
                animation: 'scan 2s linear infinite',
              },
              '@keyframes scan': {
                '0%': { transform: 'translateY(0)' },
                '100%': { transform: 'translateY(200px)' }
              }
            }} />
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ px: 2 }}>
          Apuntá tu cámara al código QR del local para anotar tu visita.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3, pt: 0 }}>
        {!isProcessing && (
          <Typography 
            variant="body2" 
            onClick={onClose}
            sx={{ 
              color: 'text.secondary', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              '&:hover': { color: 'text.primary' }
            }}
          >
            Cancelar
          </Typography>
        )}
      </DialogActions>
    </Dialog>
  );
}
