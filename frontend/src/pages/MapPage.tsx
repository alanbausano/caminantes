import { Typography, Container, Box, Paper, Button } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsIcon from '@mui/icons-material/Directions';
import { motion } from 'framer-motion';

export default function MapPage() {
  return (
    <Container maxWidth="sm" sx={{ pt: 4, pb: 4 }}>
      <Box 
        component={motion.div} 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{ mb: 4 }}
      >
        <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 800 }}>
          Encontranos
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Pasá a buscar tu burger.
        </Typography>
      </Box>

      <Paper 
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        elevation={12} 
        sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}
      >
        {/* Placeholder for actual Google Maps iframe */}
        <Box sx={{ width: '100%', height: 300, bgcolor: '#1A1A1A', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Box
            component={motion.div}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <LocationOnIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          </Box>
          <Typography variant="body1" color="text.secondary">
            Cargando el mapa...
          </Typography>
        </Box>
      </Paper>

      <Paper 
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        elevation={12} 
        sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          Los Caminantes Burger
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Av. de las Hamburguesas 123, Buenos Aires
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Abierto hoy: 11:00 a 22:00
        </Typography>
        
        <Button 
          variant="contained" 
          fullWidth 
          startIcon={<DirectionsIcon />}
          sx={{ borderRadius: 2, color: '#1A1A1A' }}
        >
          Cómo llegar
        </Button>
      </Paper>
    </Container>
  );
}
