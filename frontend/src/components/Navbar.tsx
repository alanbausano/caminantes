import { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const pages = [
  { name: 'Inicio', path: '/' },
  { name: 'Historia', path: '/#historia' },
  { name: 'Menú', path: '/#menu' },
  { name: 'Ubicación', path: '/#ubicacion' },
  { name: 'Fidelidad', path: '/app', isInternal: true }
];

const pedidosURL = 'https://www.pedidosya.com.ar/restaurantes/buenos-aires/los-caminantes-cd35e022-4177-4064-89ac-eea7c767c98b-menu'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppBar
      position="fixed"
      component={motion.nav}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      sx={{
        background: scrolled ? 'rgba(10, 10, 10, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        boxShadow: scrolled ? '0px 4px 20px rgba(0,0,0,0.5)' : 'none',
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', padding: '0.5rem 1rem' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} component={Link} to="/">
          <Box
            component={motion.div}
            initial={{ scale: 0.85, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: [0, 2, -2, 0] }}
            transition={{
              scale: { delay: 0.2, duration: 0.8, type: 'spring', stiffness: 80 },
              opacity: { delay: 0.2, duration: 0.8 },
              rotate: { delay: 1, duration: 5, ease: 'easeInOut', repeat: Infinity }
            }}
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'white',
              border: '2px solid #FFC107',
              boxShadow: '0 0 10px rgba(255, 193, 7, 0.5), 0 0 20px rgba(255, 193, 7, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 0.5,
              mr: 1.5
            }}
          >
            <Box component="img" src="/logo.png" alt="Los Caminantes Burger" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Box>
          <Typography
            variant="h6"
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '-0.5px' }}
          >
            LOS CAMINANTES BURGER
          </Typography>
        </Box>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
          {pages.map((page) => (
            <Typography
              key={page.name}
              component={page.isInternal ? Link : motion.a}
              to={page.isInternal ? page.path : undefined}
              href={!page.isInternal ? page.path : undefined}
              target={page.isInternal ? '_blank' : undefined}
              whileHover={{ color: '#FFD54F', y: -2 }}
              sx={{ 
                cursor: 'pointer', 
                fontWeight: 600, 
                fontSize: '0.95rem', 
                color: page.isInternal ? 'primary.main' : '#FFF',
                textDecoration: 'none'
              }}
            >
              {page.name}
            </Typography>
          ))}
          <Button 
            variant="contained" 
            color="primary" 
            component="a" 
            href={pedidosURL} 
            target="_blank"
            sx={{
              ml: 2,
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
        </Box>

        {/* Mobile Toggle */}
        <IconButton
          sx={{ display: { md: 'none' }, color: '#FFF' }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            sx={{
              display: { md: 'none' },
              background: '#141414',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, gap: 2 }}>
              {pages.map((page) => (
                <Typography 
                  key={page.name} 
                  component={page.isInternal ? Link : 'a'}
                  to={page.isInternal ? page.path : undefined}
                  href={!page.isInternal ? page.path : undefined}
                  target={page.isInternal ? '_blank' : undefined}
                  onClick={() => setMobileOpen(false)}
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: '1.1rem', 
                    textAlign: 'center',
                    color: page.isInternal ? 'primary.main' : '#FFF',
                    textDecoration: 'none'
                  }}
                >
                  {page.name}
                </Typography>
              ))}
              <Button 
                variant="contained" 
                fullWidth 
                component="a" 
                href={pedidosURL} 
                target="_blank"
                sx={{ 
                  mt: 1,
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
            </Box>
          </Box>
        )}
      </AnimatePresence>
    </AppBar>
  );
}
