import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.js';
import visitRoutes from './routes/visits.js';
import redemptionRoutes from './routes/redemptions.js';
import { initBirthdayCron } from './cron/birthdays.js';

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://192.168.1.1',
  'http://192.168.1.2',
  'http://192.168.1.3',
  'http://192.168.1.3:5173',
  'http://192.168.1.2:5173',
  'http://192.168.1.1:5173',
  'http://255.255.255.0:5173',
  'http://255.255.255.0',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Normalize origin (remove trailing slash for comparison)
    const normalizedOrigin = origin.replace(/\/$/, '');
    
    const isLocalhost = normalizedOrigin.startsWith('http://localhost:') || normalizedOrigin.startsWith('https://localhost:');
    const isVercel = normalizedOrigin.endsWith('.vercel.app');
    
    // Check if it's in our explicit allowed list (also normalized)
    const isAllowed = allowedOrigins.some(o => o.replace(/\/$/, '') === normalizedOrigin);

    if (isLocalhost || isVercel || isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin} (Normalized: ${normalizedOrigin})`);
      callback(new Error('CORS not allowed'), false);
    }
  },
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/redemptions', redemptionRoutes);

// Add a specific health check route for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start cron jobs
initBirthdayCron();

app.get('/', (req, res) => {
  res.send('El API de Burger Loyalty está funcionando con éxito');
});

const host = '0.0.0.0';
const server = app.listen(Number(port), host, () => {
  console.log(`Server is running successfully on port ${port}`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: El puerto ${port} ya está siendo usado por otra aplicación.`);
  } else {
    console.error('SERVER ERROR:', err);
  }
});
