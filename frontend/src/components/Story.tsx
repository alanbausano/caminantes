import { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

import storyImg1 from '@/assets/photos/LOSCAMI-6-story.jpg';
import storyImg2 from '@/assets/photos/LOSCAMI-9-story.jpg';
import storyImg3 from '@/assets/photos/LOSCAMI-11-story.jpg';
import storyImg4 from '@/assets/photos/LOSCAMI-19-story.jpg';

const storyImages = [storyImg1, storyImg2, storyImg3, storyImg4];

const textVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Story() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % storyImages.length);
    }, 4000); // 2.5 second auto-switch delay

    return () => clearInterval(timer);
  }, []);
  return (
    <Box sx={{ py: { xs: 10, md: 15 }, backgroundColor: '#0a0a0a' }} id="historia">
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component={motion.div}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.2 }
                }
              }}
              sx={{ textAlign: { xs: 'center', md: 'left' } }}
            >
              <Typography
                component={motion.h5}
                variants={textVariants}
                sx={{ color: 'primary.main', fontWeight: 600, mb: 2, textTransform: 'uppercase', letterSpacing: '2px' }}
              >
                Nuestra Historia
              </Typography>
              <Typography
                component={motion.h2}
                variants={textVariants}
                sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem' }, fontWeight: 800, mb: 4, lineHeight: 1.2 }}
              >
                La Evolución de Los Caminantes
              </Typography>
              <Typography
                component={motion.p}
                variants={textVariants}
                sx={{ color: 'text.secondary', fontSize: '1.1rem', mb: 3 }}
              >
                Hace años, Los Caminantes comenzó como una cervecería tradicional en el corazón de Almagro,
                un refugio para los vecinos del barrio.
              </Typography>
              <Typography
                component={motion.p}
                variants={textVariants}
                sx={{ color: 'text.secondary', fontSize: '1.1rem', mb: 3 }}
              >
                Con el tiempo, evolucionamos. Escuchamos a nuestros clientes, nos reinventamos y decidimos
                fusionar lo que nos apasiona: nuestro bar de siempre y las hamburguesas premium.
              </Typography>
              <Typography
                component={motion.p}
                variants={textVariants}
                sx={{ color: 'text.secondary', fontSize: '1.1rem' }}
              >
                Hoy podés disfrutar de nuestras hamburguesas en nuestro local, pedirlas a través de PedidosYa o Rappi.
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring" }}
              sx={{
                width: '100%',
                height: { xs: '300px', md: '500px' },
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)',
                position: 'relative',
                boxShadow: '0 20px 40px rgba(255,193,7,0.15)'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={storyImages[currentImageIndex]}
                  alt={`Story memory ${currentImageIndex + 1}`}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{
                    width: 'calc(100% - 8px)',
                    height: 'calc(100% - 8px)',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    borderRadius: '12px'
                  }}
                />
              </AnimatePresence>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
