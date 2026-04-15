import { Box, Typography, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const textVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Story() {
  return (
    <Box sx={{ py: { xs: 10, md: 15 }, backgroundColor: '#0a0a0a' }}>
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
                Nacidas de la pasión, creadas con fuego.
              </Typography>
              <Typography
                component={motion.p}
                variants={textVariants}
                sx={{ color: 'text.secondary', fontSize: '1.1rem', mb: 3 }}
              >
                Los Caminantes empezó como una idea humilde: crear una hamburguesa que se enfoque genuinamente en la esencia del sabor. Sin trucos, solo ingredientes locales de primera calidad y un tostado perfecto a la parrilla.
              </Typography>
              <Typography
                component={motion.p}
                variants={textVariants}
                sx={{ color: 'text.secondary', fontSize: '1.1rem' }}
              >
                Cada bocado es un viaje—un recorrido a través de nuestra dedicación para lograr la máxima experiencia de confort que siempre te dejará con ganas de más.
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
              <img
                src="/story_burger_flame.png"
                alt="Burger over flames"
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
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
