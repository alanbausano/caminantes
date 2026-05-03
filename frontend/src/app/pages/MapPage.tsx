import { Typography, Container, Box, Paper, Button } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsIcon from '@mui/icons-material/Directions';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { motion } from 'framer-motion';

const LAT = -34.6000952;
const LNG = -58.4178533;
const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`;
const MAPS_EMBED_URL = `https://maps.google.com/maps?q=${LAT},${LNG}&z=16&hl=es&output=embed`;

export default function MapPage() {
  const handleGetDirections = () => {
    window.open(MAPS_DIRECTIONS_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 2.5, sm: 4 }, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box 
        component={motion.div} 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
          Encontranos
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          Pasá a buscar tu hamburguesa.
        </Typography>
      </Box>

      {/* Real Google Maps iframe embed */}
      <Paper 
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        elevation={12} 
        sx={{ borderRadius: 2, overflow: 'hidden', flexShrink: 0, border: '2px solid', borderColor: 'primary.main' }}
      >
        <Box sx={{ width: '100%', height: { xs: 260, sm: 320 }, position: 'relative' }}>
          <iframe
            title="Los Caminantes ubicación"
            src={MAPS_EMBED_URL}
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Box>
      </Paper>

      {/* Location info + directions button */}
      <Paper 
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        elevation={12} 
        sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', mt: 'auto' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
          <LocationOnIcon sx={{ color: 'primary.main', mt: 0.3, flexShrink: 0 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.5 }}>
              Los Caminantes Burger
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lavalle 3702, Buenos Aires
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <AccessTimeIcon sx={{ color: 'text.disabled', flexShrink: 0 }} fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            Viernes y Sábados de 20:00 a 00:30
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          fullWidth 
          startIcon={<DirectionsIcon />}
          onClick={handleGetDirections}
          sx={{ borderRadius: 2, color: '#1A1A1A', py: 1.5, fontWeight: 'bold' }}
        >
          Cómo llegar
        </Button>
      </Paper>
    </Container>
  );
}
