import { Box, Typography, Container, Grid, Card, CardContent, Button } from '@mui/material';
import { motion } from 'framer-motion';

const mockMenuItems = [
  { id: 1, title: 'El Caminante Clásico', desc: 'Doble hamburguesa smash, queso americano, salsa de la casa, pepinillos.', price: '$12' },
  { id: 2, title: 'Queso Dorado', desc: 'Panceta crujiente, cheddar derretido, cebollas caramelizadas, salsa BBQ.', price: '$14' },
  { id: 3, title: 'El Nómada Picante', desc: 'Queso pepper jack, jalapeños frescos, mayonesa picante, lechuga.', price: '$13' },
];

export default function FeaturedMenu() {
  return (
    <Box sx={{ py: 15, backgroundColor: '#141414' }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography
            component={motion.h5}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            sx={{ color: 'secondary.main', fontWeight: 600, mb: 1, textTransform: 'uppercase', letterSpacing: '2px' }}
          >
            Las Especialidades
          </Typography>
          <Typography
            component={motion.h2}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem' }, fontWeight: 800 }}
          >
            Favoritas de Siempre
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {mockMenuItems.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
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
                  <Box sx={{ height: 200, display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                    <img 
                      src="/menu_burger_item.png" 
                      alt={item.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                       <Typography variant="h5" sx={{ fontWeight: 700 }}>{item.title}</Typography>
                       <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>{item.price}</Typography>
                    </Box>
                    <Typography color="text.secondary" sx={{ mb: 4, flexGrow: 1 }}>
                      {item.desc}
                    </Typography>
                    <Button variant="contained" color="primary" fullWidth sx={{ borderRadius: 28, py: 1.5, fontWeight: 700, color: '#0A0A0A' }}>
                      Agregar a la Orden
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
