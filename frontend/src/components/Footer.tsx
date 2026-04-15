import { Box, Typography, Container, Stack, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
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
            Vení a probar nuestras hamburguesas.
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 8 }} sx={{ mt: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#FFF' }}>
                Ubicación
              </Typography>
              <Typography color="text.secondary">
                Bulnes 998<br />
                Buenos Aires, Argentina
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#FFF' }}>
                Horarios
              </Typography>
              <Typography color="text.secondary">
                Vie - Sab: 20:00 - 00:00
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#FFF' }}>
                Contacto
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                <IconButton component="a" href="https://wa.me/5491123541273" target="_blank" sx={{ color: 'text.secondary', '&:hover': { color: '#25D366' } }}>
                  <WhatsAppIcon />
                </IconButton>
                <IconButton component="a" href="https://www.instagram.com/loscaminantesburger/" target="_blank" sx={{ color: 'text.secondary', '&:hover': { color: '#E1306C' } }}>
                  <InstagramIcon />
                </IconButton>
              </Box>
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
