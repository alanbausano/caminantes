import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedMenu from '../components/FeaturedMenu';
import Story from '../components/Story';
import Location from '../components/Location';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <Navbar />
      <Hero />
      <Story />
      <FeaturedMenu />
      <Location />
      <Footer />
    </Box>
  );
}
