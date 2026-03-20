import { Typography, Container, Box, Paper, TextField, Button, Avatar, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useProfile } from '../hooks/useVisits';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { data: userData, isLoading } = useProfile();

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ pt: 10, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 4, pb: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box 
        component={motion.div} 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}
      >
        <Avatar 
          component={motion.div}
          whileHover={{ scale: 1.1, rotate: 5 }}
          sx={{ width: 64, height: 64, bgcolor: 'primary.main', color: '#1A1A1A', fontSize: '1.5rem', fontWeight: 'bold' }}
        >
          {userData?.firstName?.charAt(0) || 'U'}
        </Avatar>
        <Box>
          <Typography variant="h5" color="text.primary" sx={{ fontWeight: 800 }}>
            {userData?.firstName} {userData?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Miembro desde: {new Date(userData?.createdAt || Date.now()).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
          </Typography>
        </Box>
      </Box>

      <Paper 
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 80 }}
        elevation={12} 
        sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', mb: 4 }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
          Tus datos
        </Typography>
        
        <Box component="form" autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField 
            label="Nombre Completo" 
            value={userData ? `${userData.firstName} ${userData.lastName}` : ''}
            variant="outlined" 
            fullWidth 
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField 
            label="Correo Electrónico" 
            value={userData?.email || ''}
            type="email" 
            variant="outlined" 
            fullWidth 
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField 
            label="Número de Teléfono" 
            value={userData?.phone || ''}
            type="tel" 
            variant="outlined" 
            fullWidth 
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField 
            label="Fecha de Nacimiento" 
            type="text"
            value={userData?.dob ? new Date(userData.dob).toLocaleDateString() : ''}
            variant="outlined" 
            fullWidth 
            slotProps={{ input: { readOnly: true } }}
            helperText="¡Te vamos a mandar un regalo para tu cumple!"
          />
        </Box>
      </Paper>

      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        sx={{ mt: 'auto' }}
      >
        <Button 
          variant="contained" color="error"
          fullWidth 
          startIcon={<ExitToAppIcon />}
          onClick={handleLogout}
          sx={{ borderRadius: 2, py: 1.5 }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Container>
  );
}
