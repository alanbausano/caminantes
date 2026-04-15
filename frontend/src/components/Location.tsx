import { Box, Typography, Container, Grid, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsIcon from '@mui/icons-material/Directions';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const LAT = -34.6000952;
const LNG = -58.4178533;
const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`;
const MAPS_EMBED_URL = `https://maps.google.com/maps?q=${LAT},${LNG}&z=16&hl=es&output=embed`;

export default function Location() {
  const handleGetDirections = () => {
    window.open(MAPS_DIRECTIONS_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box sx={{ py: 15, backgroundColor: '#0a0a0a' }} id="location">
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography
            component={motion.h5}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            sx={{ color: 'secondary.main', fontWeight: 600, mb: 1, textTransform: 'uppercase', letterSpacing: '2px' }}
          >
            Nuestra Casa
          </Typography>
          <Typography
            component={motion.h2}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem' }, fontWeight: 800 }}
          >
            Ubicación
          </Typography>
        </Box>

        <Grid container spacing={6} alignItems="center">
          {/* Info Details Container */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 4 }}>
                <LocationOnIcon sx={{ color: 'primary.main', mt: 0.5, fontSize: '2rem' }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#FFF' }}>
                    Los Caminantes
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Bulnes 998<br/>Buenos Aires, Argentina
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5 }}>
                <AccessTimeIcon sx={{ color: 'primary.main', fontSize: '2rem' }} />
                <Box>
                   <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, color: '#FFF' }}>Horarios</Typography>
                   <Typography variant="body1" color="text.secondary">
                    Jueves a Sábados: 20:00 a 00:30<br/>
                    Domingos: 20:00 a 00:00
                   </Typography>
                </Box>
              </Box>

              <Button 
                variant="contained" 
                fullWidth 
                size="large"
                startIcon={<DirectionsIcon />}
                onClick={handleGetDirections}
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                sx={{ borderRadius: 28, color: '#0A0A0A', py: 1.5, fontWeight: 700, fontSize: '1.1rem' }}
              >
                Cómo llegar
              </Button>
            </Box>
          </Grid>

          {/* Map Container */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper 
              component={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.2, duration: 0.6 }}
              elevation={12} 
              sx={{ 
                borderRadius: 4, 
                overflow: 'hidden', 
                border: '2px solid rgba(255, 193, 7, 0.3)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)' 
              }}
            >
              <Box sx={{ width: '100%', height: { xs: 300, sm: 400, md: 500 }, position: 'relative' }}>
                <iframe
                  title="Los Caminantes Google Maps Location"
                  src={MAPS_EMBED_URL}
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: 'block', filter: 'invert(90%) hue-rotate(180deg)', opacity: 0.8 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                
                {/* Optional dark overlay to match theme better */}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, left: 0, right: 0, bottom: 0, 
                    pointerEvents: 'none', 
                    backgroundColor: 'rgba(10, 10, 10, 0.2)' 
                  }} 
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
