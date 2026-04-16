import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import HeroBackground from './HeroBackground';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.4 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 50, damping: 12 } },
};

export default function Hero() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0A0A0A',
        overflow: 'hidden',
        pt: 8
      }}
    >
      <HeroBackground />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box
            component={motion.div}
            variants={itemVariants}
            initial={{ scale: 0.85, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: [0, 2, -2, 0] }}
            transition={{
              scale: { delay: 0.2, duration: 0.8, type: 'spring', stiffness: 80 },
              opacity: { delay: 0.2, duration: 0.8 },
              rotate: { delay: 1, duration: 5, ease: 'easeInOut', repeat: Infinity }
            }}
            sx={{
              width: 180,
              height: 180,
              borderRadius: '50%',
              bgcolor: 'white',
              border: '4px solid #FFC107',
              boxShadow: '0 0 40px rgba(255, 193, 7, 0.5), 0 0 80px rgba(255, 193, 7, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 1.5,
              mx: 'auto',
              mb: 4
            }}
          >
            <Box component="img" src="/logo.png" alt="Los Caminantes Burger" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Box>

          <Typography
            variant="subtitle1"
            component={motion.h2}
            variants={itemVariants}
            sx={{
              color: 'secondary.main',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              mb: 2
            }}
          >
            Vení a probar un sabor único
          </Typography>

          <Typography
            variant="h1"
            component={motion.h1}
            variants={itemVariants}
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '6rem' },
              lineHeight: 1.1,
              mb: 3,
              background: 'linear-gradient(180deg, #FFFFFF 0%, #B0B0B0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Hamburguesas de Asado
          </Typography>

          <Typography
            variant="h6"
            component={motion.p}
            variants={itemVariants}
            sx={{
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
              mb: 5,
              fontWeight: 400
            }}
          >
            No picamos carne al azar. Seleccionamos cortes de asado, respetando los tiempos de plancha para que cada mordida tenga el alma de una parrilla encendida.
          </Typography>

          <Box
            component={motion.div}
            variants={itemVariants}
            sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' } }}
          >
            <Button
              variant="contained"
              size="large"
              component={motion.a}
              href="https://www.pedidosya.com.ar/restaurantes/buenos-aires/los-caminantes-cd35e022-4177-4064-89ac-eea7c767c98b-menu"
              target="_blank"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{ 
                px: 5, 
                py: 1.5, 
                fontSize: '1.1rem',
                color: '#0A0A0A',
                fontWeight: 700,
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: '#0A0A0A'
                }
              }}
            >
              Pedir Online
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={motion.a}
              href="#menu"
              whileHover={{ scale: 1.05, borderColor: '#FFC107', color: '#FFC107' }}
              whileTap={{ scale: 0.95 }}
              sx={{
                px: 5, py: 1.5, fontSize: '1.1rem',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFF'
              }}
            >
              Ver Menú
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
