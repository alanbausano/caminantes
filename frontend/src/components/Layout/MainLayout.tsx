import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import MapIcon from '@mui/icons-material/Map';
import PersonIcon from '@mui/icons-material/Person';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    switch (location.pathname) {
      case '/dashboard': setValue(0); break;
      case '/menu': setValue(1); break;
      case '/map': setValue(2); break;
      case '/profile': setValue(3); break;
      default: setValue(0);
    }
  }, [location.pathname]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0: navigate('/dashboard'); break;
      case 1: navigate('/menu'); break;
      case 2: navigate('/map'); break;
      case 3: navigate('/profile'); break;
    }
  };

  return (
    <Box sx={{ pb: 7, height: '100vh', overflowY: 'auto' }}>
      <Outlet />
      
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={handleChange}
          sx={{ 
            backgroundColor: 'background.paper',
            borderTop: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <BottomNavigationAction label="Inicio" icon={<DashboardIcon />} />
          <BottomNavigationAction label="Menú" icon={<RestaurantMenuIcon />} />
          <BottomNavigationAction label="Mapa" icon={<MapIcon />} />
          <BottomNavigationAction label="Perfil" icon={<PersonIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
