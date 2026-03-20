import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.js';
import visitRoutes from './routes/visits.js';
import { initBirthdayCron } from './cron/birthdays.js';

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const isLocalhost = origin.startsWith('http://localhost:') || origin.startsWith('https://localhost:');
    const isVercel = origin.endsWith('.vercel.app');
    const isAllowed = allowedOrigins.includes(origin);

    if (isLocalhost || isVercel || isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error('CORS not allowed'), false);
    }
  },
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/visits', visitRoutes);

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
