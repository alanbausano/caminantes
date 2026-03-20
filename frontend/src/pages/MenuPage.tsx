import { Typography, Container, Box, Card, CardContent } from '@mui/material';
import { motion, type Variants } from 'framer-motion';

const mockMenu = [
  { id: 1, name: 'La Clásica', desc: 'Carne, cheddar, lechuga, tomate y la infaltable salsa de la casa', price: '$8.99' },
  { id: 2, name: 'Doble Problema', desc: 'Doble carne, doble cheddar, panceta crocante y salsa BBQ', price: '$12.99' },
  { id: 3, name: 'Infierno Picante', desc: 'Carne, pepper jack, jalapeños y mayonesa picante', price: '$10.49' },
  { id: 4, name: 'Hongo Trufa', desc: 'Carne, queso suizo, champiñones salteados y alioli de trufa', price: '$11.99' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

export default function MenuPage() {
  return (
    <Container maxWidth="sm" sx={{ pt: 4, pb: 4 }}>
      <Box 
        component={motion.div} 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        sx={{ mb: 4 }}
      >
        <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 800 }}>
          Nuestro Menú
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Hamburguesas artesanales hechas con pasión.
        </Typography>
      </Box>

      <Box 
        component={motion.div} 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        {mockMenu.map((item) => (
          <Box component={motion.div} variants={itemVariants} key={item.id}>
            <Card elevation={8} sx={{ display: 'flex', borderRadius: 2, bgcolor: 'background.paper' }}>
              <Box sx={{ width: 100, bgcolor: 'rgba(255, 193, 7, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                 <Typography variant="h2">🍔</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <CardContent sx={{ pb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography component="div" variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.5 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 800 }}>
                      {item.price}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
