import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoyaltyApp from './app/LoyaltyApp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app/*" element={<LoyaltyApp />} />
      
      {/* Redirect root-level app paths to the /app subfolder */}
      <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/menu" element={<Navigate to="/app/menu" replace />} />
      <Route path="/map" element={<Navigate to="/app/map" replace />} />
      <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
      <Route path="/admin" element={<Navigate to="/app/admin" replace />} />
      <Route path="/verify" element={<Navigate to="/app/verify" replace />} />
      <Route path="/scan/:id" element={<NavigateToScan />} />
    </Routes>
  );
}

const NavigateToScan = () => {
  const { id } = useParams();
  return <Navigate to={`/app/scan/${id}`} replace />;
};

export default App;
