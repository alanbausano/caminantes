import { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, IconButton, Dialog, Zoom } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import menuImage from '@/assets/menu_main.jpeg';

const pages = [
  { name: 'Inicio', path: '/' },
  { name: 'Hamburguesas', path: '/#menu' },
  { name: 'Historia', path: '/#historia' },
  { name: 'Ubicación', path: '/#ubicacion' },
  { name: 'Menú', isMenuAction: true },
  { name: 'Registrate', path: '/app', isInternal: true }
];

const pedidosURL = 'https://www.pedidosya.com.ar/restaurantes/buenos-aires/los-caminantes-16513ef5-0d16-45e3-96bd-2e21fa293456-menu?origin=shop_list'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = menuImage;
    link.download = 'Menu-Los-Caminantes.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppBar
      position="fixed"
      component={motion.nav}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      sx={{
        background: scrolled ? 'rgba(10, 10, 10, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        boxShadow: scrolled ? '0px 4px 20px rgba(0,0,0,0.5)' : 'none',
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
        zIndex: 1100
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
              href={!page.isInternal && !page.isMenuAction ? page.path : undefined}
              target={page.isInternal ? '_blank' : undefined}
              onClick={() => page.isMenuAction && setMenuOpen(true)}
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
                  href={!page.isInternal && !page.isMenuAction ? page.path : undefined}
                  target={page.isInternal ? '_blank' : undefined}
                  onClick={() => {
                    if (page.isMenuAction) {
                      setMenuOpen(true);
                    }
                    setMobileOpen(false);
                  }}
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

      {/* Full Menu Dialog (Same as Loyalty App) */}
      <Dialog
        fullScreen
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0,0,0,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 0,
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ position: 'fixed', top: 16, right: 16, display: 'flex', gap: 1, zIndex: 1200 }}>
          <IconButton
            onClick={handleDownload}
            sx={{
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              backdropFilter: 'blur(5px)'
            }}
          >
            <DownloadIcon />
          </IconButton>
          <IconButton
            onClick={() => setMenuOpen(false)}
            sx={{
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              backdropFilter: 'blur(5px)'
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          component="img"
          src={menuImage}
          alt="Menú Los Caminantes"
          onClick={() => setMenuOpen(false)}
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            cursor: 'zoom-out',
            p: 2
          }}
        />

        {/* Floating Download Button for Mobile */}
        <Box sx={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: { xs: 'block', md: 'none' } }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{
              borderRadius: 28,
              px: 4,
              py: 1.5,
              fontWeight: 700,
              boxShadow: '0 8px 32px rgba(255, 193, 7, 0.3)'
            }}
          >
            Descargar Menú
          </Button>
        </Box>
      </Dialog>
    </AppBar>
  );
}
