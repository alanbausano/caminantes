import { Box, Typography, Container, Stack } from '@mui/material';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <Box sx={{ py: 10, backgroundColor: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center">
          <Box
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              bgcolor: 'white',
              border: '2px solid #FFC107',
              boxShadow: '0 0 20px rgba(255, 193, 7, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 1,
            }}
          >
            <Box component="img" src="/logo.png" alt="Los Caminantes Burger" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '1px' }}>
            LOS CAMINANTES
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: '1.1rem', maxWidth: '500px' }}>
            El viaje de mil millas comienza con el primer bocado.
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 8 }} sx={{ mt: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#FFF' }}>
                Ubicación
              </Typography>
              <Typography color="text.secondary">
                123 Burger Lane<br />
                Distrito Gastronómico, MVD 11200<br />
                Uruguay
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#FFF' }}>
                Horarios
              </Typography>
              <Typography color="text.secondary">
                Lun - Jue: 11:30 AM - 11:00 PM<br />
                Vie - Dom: 11:30 AM - 1:00 AM
              </Typography>
            </Box>
          </Stack>
        </Stack>

        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.05)', mt: 8, pt: 4 }}>
          <Typography color="text.secondary" variant="body2">
            &copy; {new Date().getFullYear()} Los Caminantes Burger. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
