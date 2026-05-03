import { useState } from 'react';
import { Typography, Container, Box, Button, Dialog, IconButton, Zoom } from '@mui/material';
import { motion } from 'framer-motion';
import DownloadIcon from '@mui/icons-material/Download';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import menuImage from '../assets/menu_main.jpeg';

export default function MenuPage() {
  const [open, setOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = menuImage;
    link.download = 'Menu-Los-Caminantes.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 4, pb: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Box 
        component={motion.div} 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 800 }}>
          Nuestro Menú
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Elegí tu hamburguesa favorita.
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          startIcon={<ZoomInIcon />}
          onClick={() => setOpen(true)}
          fullWidth
          sx={{ borderRadius: 2, fontWeight: 'bold', color: '#1A1A1A' }}
        >
          Zoom
        </Button>
        <Button 
          variant="contained" 
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          fullWidth
          sx={{ borderRadius: 2, fontWeight: 'bold'}}
        >
          Descargar
        </Button>
      </Box>

      {/* Menu Image Container */}
      <Box 
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        onClick={() => setOpen(true)}
        sx={{ 
          position: 'relative',
          cursor: 'zoom-in',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '2px solid rgba(255,193,7,0.1)',
          lineHeight: 0
        }}
      >
        <img 
          src={menuImage} 
          alt="Menú Los Caminantes" 
          style={{ width: '100%', height: 'auto', display: 'block' }} 
        />
        
        {/* Subtle hover overlay hint */}
        <Box sx={{ 
          position: 'absolute', 
          inset: 0, 
          bgcolor: 'rgba(0,0,0,0)', 
          transition: 'background-color 0.3s',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ZoomInIcon sx={{ color: 'white', opacity: 0, transition: 'opacity 0.3s', fontSize: 48 }} />
        </Box>
      </Box>

      {/* Zoom Dialog */}
      <Dialog
        fullScreen
        open={open}
        onClose={() => setOpen(false)}
        TransitionComponent={Zoom}
        PaperProps={{
          sx: { bgcolor: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0 }
        }}
      >
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ position: 'fixed', top: 16, right: 16, color: 'white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
        >
          <CloseIcon />
        </IconButton>
        
        <Box 
          component="img" 
          src={menuImage} 
          alt="Menú Zoom" 
          onClick={() => setOpen(false)}
          sx={{ 
            maxWidth: '100%', 
            maxHeight: '100%', 
            objectFit: 'contain',
            cursor: 'zoom-out'
          }} 
        />
      </Dialog>
    </Container>
  );
}
