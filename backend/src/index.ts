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

// Start cron jobs
initBirthdayCron();

app.get('/', (req, res) => {
  res.send('El API de Burger Loyalty está funcionando con éxito');
});

// Log de diagnóstico al arrancar
console.log('--- DIAGNÓSTICO DE ARRANQUE ---');
console.log('DATABASE_URL configurada:', process.env.DATABASE_URL ? 'SÍ (Ok)' : 'NO (ERROR)');
console.log('JWT_SECRET configurado:', process.env.JWT_SECRET ? 'SÍ (Ok)' : 'NO (ERROR)');
console.log('GOOGLE_CLIENT_ID configurado:', process.env.GOOGLE_CLIENT_ID ? 'SÍ (Ok)' : 'NO (ERROR)');
console.log('Puerto asignado:', port);
console.log('-------------------------------');

const server = app.listen(Number(port), () => {
  console.log(`Server is running successfully on port ${port}`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: El puerto ${port} ya está siendo usado por otra aplicación.`);
  } else {
    console.error('SERVER ERROR:', err);
  }
});
