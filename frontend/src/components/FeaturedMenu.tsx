import { useState } from 'react';
import { Box, Typography, Container, Card, CardContent, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Simple versions
import caminanteSimple from '@/assets/photos/caminante-menu.jpg';
import baconSimple from '@/assets/photos/bacon-menu.jpg';
import cucuSimple from '@/assets/photos/cucu-menu.jpg';

// Doble versions
import caminanteDoble from '@/assets/photos/caminante-doble-menu.jpg';
import baconDoble from '@/assets/photos/bacon-doble-menu.jpg';
import cucuDoble from '@/assets/photos/cucumber-doble-menu.jpg';


const mockMenuItems = [
  { 
    id: 1, 
    title: 'CAMINANTE', 
    desc: { simple: '1 medallón de carne de asado, cheddar, lechuga, tomate, panceta, y salsa de la casa', doble: '2 medallones de carne de asado, cheddar, lechuga, tomate, panceta, y salsa de la casa' } , 
    images: { simple: caminanteSimple, doble: caminanteDoble } 
  },
  { 
    id: 2, 
    title: 'CUCUMBER', 
    desc: { simple: '1 medallón de carne de asado, cheddar, relish de pepino, cebolla, ketchup y mostaza.', doble: '2 medallones de carne de asado, cheddar, relish de pepino, cebolla, ketchup y mostaza.' } , 
    images: { simple: cucuSimple, doble: cucuDoble } 
  },
  { 
    id: 3, 
    title: 'CHEDDAR Y PANCETA', 
    desc: { simple: '1 medallón de carne de asado, cheddar, panceta y barbacoa Kansas.', doble: '2 medallones de carne de asado, cheddar, panceta y barbacoa Kansas.' } , 
    images: { simple: baconSimple, doble: baconDoble } 
  },
];

const BurgerCard = ({ item, index }: { item: typeof mockMenuItems[0], index: number }) => {
  const [size, setSize] = useState<'simple' | 'doble'>('simple');

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ y: -10, scale: 1.02, boxShadow: '0px 20px 50px rgba(255, 193, 7, 0.25)' }}
      style={{ height: '100%', borderRadius: '16px' }}
    >
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(10px)',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
           boxShadow: '0 12px 30px rgba(255, 193, 7, 0.15)',
           borderColor: 'rgba(255,193,7,0.3)'
        }
      }}>
        <Box sx={{ height: 250, display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.img 
              key={size}
              src={item.images[size]} 
              alt={`${item.title} ${size}`} 
              decoding="async"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }} 
            />
          </AnimatePresence>
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 4 }}>
          <Box sx={{ mb: 2 }}>
             <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '0.1rem' }}>{item.title}</Typography>
          </Box>
          <Typography color="text.secondary" sx={{ mb: 4, flexGrow: 1, minHeight: '60px' }}>
            {item.desc[size]}
          </Typography>

          <ToggleButtonGroup
            value={size}
            exclusive
            onChange={(_, newSize) => newSize && setSize(newSize)}
            fullWidth
            sx={{ 
              mt: 2,
              '& .MuiToggleButton-root': {
                color: 'text.secondary',
                borderColor: 'rgba(255,255,255,0.1)',
                py: 1,
                mx: 2,
                borderRadius: '28px',
                fontWeight: 700,
                flex: 1,
                fontSize: '0.9rem',
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: '#0A0A0A',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  }
                },
                '&:first-of-type': {
                  borderTopLeftRadius: '28px',
                  borderBottomLeftRadius: '28px',
                },
                '&:last-of-type': {
                  borderTopRightRadius: '28px',
                  borderBottomRightRadius: '28px',
                }
              }
            }}
          >
            <ToggleButton value="simple">Simple</ToggleButton>
            <ToggleButton value="doble">Doble</ToggleButton>
          </ToggleButtonGroup>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function FeaturedMenu() {
  return (
    <Box id="menu" sx={{ py: 15, backgroundColor: '#0A0A0A' }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={10}>
          <Typography
            component={motion.h5}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            sx={{ color: 'primary.main', fontWeight: 600, mb: 1, textTransform: 'uppercase', letterSpacing: '2px' }}
          >
            Las Especialidades
          </Typography>
          <Typography
            component={motion.h2}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            sx={{ fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' }, fontWeight: 800, color: '#fff' }}
          >
            Nuestras Hamburguesas
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 4 }}>
          {mockMenuItems.map((item, index) => (
            <BurgerCard key={item.id} item={item} index={index} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
