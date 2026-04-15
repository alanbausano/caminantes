import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoyaltyApp from './app/LoyaltyApp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app/*" element={<LoyaltyApp />} />
    </Routes>
  );
}

export default App;
