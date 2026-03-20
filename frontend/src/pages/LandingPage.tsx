import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Container, Box, Button, TextField, Paper, Tabs, Tab, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import heroBurger from '../assets/hero_burger.png';
import { useToast } from '../context/ToastContext';
import { useRegister, useLogin } from '../hooks/useAuth';
import type { AxiosError } from 'axios';

export default function LandingPage() {
  const [tab, setTab] = useState(0); // 0: Login, 1: Register
  const { showToast } = useToast();
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const loginMutation = useLogin();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    password: ''
  });

  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    password: ''
  });

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\d{10,15}$/.test(phone);
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateForm = () => {
    const errors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dob: '',
      password: ''
    };
    let isValid = true;

    if (tab === 1) { // Register validations
      if (!formData.firstName.trim()) {
        errors.firstName = 'El nombre es obligatorio';
        isValid = false;
      }
      if (!formData.lastName.trim()) {
        errors.lastName = 'El apellido es obligatorio';
        isValid = false;
      }
      if (!formData.phone.trim()) {
        errors.phone = 'El teléfono es obligatorio';
        isValid = false;
      } else if (!validatePhone(formData.phone)) {
        errors.phone = 'Formato inválido (mínimo 10 dígitos)';
        isValid = false;
      }
      if (!formData.dob) {
        errors.dob = 'La fecha de nacimiento es obligatoria';
        isValid = false;
      } else if (calculateAge(formData.dob) < 13) {
        errors.dob = 'Tenés que ser mayor de 13 años';
        isValid = false;
      }
      if (formData.password.length < 6) {
        errors.password = 'Tiene que tener al menos 6 caracteres';
        isValid = false;
      }
    }

    if (!formData.email.trim()) {
      errors.email = 'El correo es obligatorio';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Formato de correo inválido';
      isValid = false;
    }

    if (tab === 0 && !formData.password) {
      errors.password = 'La contraseña es obligatoria';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (tab === 1) { // Register
      registerMutation.mutate(formData, {
        onSuccess: () => {
          showToast('¡Cuenta creada con éxito!', 'success');
          navigate('/dashboard');
        },
        onError: (error: AxiosError<{ error: string }>) => {
          const backendError = error.response?.data?.error || '';
          if (backendError.toLowerCase().includes('correo') || backendError.toLowerCase().includes('registrado')) {
            setFormErrors(prev => ({ ...prev, email: 'Este correo ya está registrado' }));
          }
          showToast(backendError || 'Hubo un error al crear tu cuenta', 'error');
        }
      });
    } else { // Login
      loginMutation.mutate({
        email: formData.email,
        password: formData.password
      }, {
        onSuccess: () => {
          showToast('¡Qué bueno verte de nuevo!', 'success');
          navigate('/dashboard');
        },
        onError: (error: AxiosError<{ error: string }>) => {
          showToast(error.response?.data?.error || 'El correo o la contraseña no son correctos', 'error');
        }
      });
    }
  };

  const loading = registerMutation.isPending || loginMutation.isPending;

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', pt: 4, pb: 6 }}>
      {/* Hero Section */}
      <Box 
        component={motion.div} 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        sx={{ textAlign: 'center', mb: 4 }}
      >
        <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 800 }}>
          Los Caminantes Burger
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Sumate a nuestro club y ganá hamburguesas gratis.
        </Typography>
        <Box
          component={motion.img}
          src={heroBurger}
          alt="Hamburguesa Deliciosa"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          sx={{
            width: '100%',
            maxWidth: '320px',
            borderRadius: '24px',
            boxShadow: '0px 20px 40px rgba(0,0,0,0.5)',
            border: '2px solid rgba(255,255,255,0.05)',
          }}
        />
      </Box>

      {/* Auth Form */}
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        elevation={24}
        sx={{ p: 4, borderRadius: 2, backgroundColor: 'background.paper', overflow: 'hidden' }}
      >
        <Tabs 
          value={tab} 
          onChange={(_, newValue) => setTab(newValue)} 
          variant="fullWidth" 
          sx={{ mb: 3 }}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Ingresá" sx={{ fontWeight: 'bold' }} />
          <Tab label="Creá tu cuenta" sx={{ fontWeight: 'bold' }} />
        </Tabs>

        <Box component="form" onSubmit={handleAuth} noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={tab === 0 ? 'login' : 'register'}
              initial={{ opacity: 0, x: tab === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: tab === 0 ? 20 : -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {tab === 1 && (
                <>
                  <TextField 
                    label="Nombre" 
                    name="firstName"
                    variant="outlined" 
                    fullWidth 
                    error={!!formErrors.firstName}
                    helperText={formErrors.firstName}
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  <TextField 
                    label="Apellido" 
                    name="lastName"
                    variant="outlined" 
                    fullWidth 
                    error={!!formErrors.lastName}
                    helperText={formErrors.lastName}
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </>
              )}
              <TextField 
                label="Correo Electrónico" 
                name="email"
                type="email" 
                variant="outlined" 
                fullWidth 
                error={!!formErrors.email}
                helperText={formErrors.email}
                value={formData.email}
                onChange={handleInputChange}
                autoComplete='off'
              />
              {tab === 1 && (
                <TextField 
                  label="Número de Teléfono" 
                  name="phone"
                  type="tel" 
                  variant="outlined" 
                  fullWidth 
                  error={!!formErrors.phone}
                  helperText={formErrors.phone}
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              )}
              {tab === 1 && (
                <TextField 
                  label="Fecha de Nacimiento" 
                  name="dob"
                  type="date" 
                  variant="outlined" 
                  InputLabelProps={{ shrink: true }}
                  fullWidth 
                  error={!!formErrors.dob}
                  helperText={formErrors.dob}
                  value={formData.dob}
                  onChange={handleInputChange}
                />
              )}
              <TextField 
                label="Contraseña" 
                name="password"
                type="password" 
                variant="outlined" 
                fullWidth 
                error={!!formErrors.password}
                helperText={formErrors.password}
                value={formData.password}
                onChange={handleInputChange}
              />
            </motion.div>
          </AnimatePresence>

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="large" 
            disabled={loading}
            sx={{ mt: 3, py: 1.5, color: '#1A1A1A' }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#1A1A1A' }} /> : (tab === 0 ? 'Ingresá' : 'Sumate ahora')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
