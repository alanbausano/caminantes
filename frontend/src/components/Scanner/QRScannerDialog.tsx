import { useEffect, useRef, useState, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Alert, CircularProgress } from '@mui/material';
import { BrowserQRCodeReader } from '@zxing/library';

interface QRScannerDialogProps {
  open: boolean;
  onClose: () => void;
  onScanSuccess: (code: string) => void;
  isProcessing?: boolean;
}

export default function QRScannerDialog({ open, onClose, onScanSuccess, isProcessing = false }: QRScannerDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const hasScannedRef = useRef(false); // Prevent multiple fires on the same QR frame
  const [error, setError] = useState<string | null>(null);

  const scanCallbackRef = useRef(onScanSuccess);
  
  // Keep the callback ref up to date without triggering effect re-runs
  useEffect(() => {
    scanCallbackRef.current = onScanSuccess;
  }, [onScanSuccess]);

  const handleScanOnce = useCallback((code: string) => {
    if (hasScannedRef.current || isProcessing) return;
    hasScannedRef.current = true;
    console.log("QR detected, triggering callback:", code);
    scanCallbackRef.current(code);
  }, [isProcessing]);

  useEffect(() => {
    if (!open) return;

    hasScannedRef.current = false;
    setError(null);

    const startCamera = async () => {
      try {
        // Step 1: Request camera access via native getUserMedia (triggers permission prompt on mobile)
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }
        });
        streamRef.current = stream;

        // Step 2: Assign the stream to the video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {}); // Autoplay may fail silently
        }

        // Step 3: Start ZXing decoding from the now-live video element
        const reader = new BrowserQRCodeReader();
        codeReaderRef.current = reader;

        if (videoRef.current) {
          reader.decodeFromVideoElement(videoRef.current).then((result) => {
            if (result) {
              handleScanOnce(result.getText());
            }
          }).catch((e) => {
            // ZXing throws when the video ends / is reset — this is expected on cleanup
            if (e?.name !== 'NotFoundException') {
              console.warn('ZXing decode ended:', e);
            }
          });
        }
      } catch (e: any) {
        console.error('Camera permission/start error:', e);
        if (e?.name === 'NotAllowedError') {
          setError('Permiso de cámara denegado. Habilitá el acceso en la configuración de tu navegador.');
        } else if (e?.name === 'NotFoundError') {
          setError('No se encontró ninguna cámara en este dispositivo.');
        } else {
          setError('No pudimos acceder a la cámara. Verificá los permisos y que uses HTTPS.');
        }
      }
    };

    startCamera();

    return () => {
      // Stop the native stream tracks (this turns off the camera light on mobile)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
        codeReaderRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
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
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              filter: isProcessing ? 'blur(4px) grayscale(0.5)' : 'none',
              transition: 'filter 0.3s ease'
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
              bgcolor: 'rgba(26, 26, 26, 0.4)',
              zIndex: 2,
              backdropFilter: 'blur(2px)'
            }}>
              <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                Procesando...
              </Typography>
            </Box>
          )}

          {/* Scanning frame overlay */}
          {!isProcessing && (
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
