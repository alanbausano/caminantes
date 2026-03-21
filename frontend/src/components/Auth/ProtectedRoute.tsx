import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useProfile } from '../../hooks/useAuth';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { data: user, isLoading } = useProfile();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!user) {
    // Redirect to landing if not logged in
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requireAdmin && !user.isAdmin) {
    // Redirect to dashboard if trying to access admin page without being admin
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
