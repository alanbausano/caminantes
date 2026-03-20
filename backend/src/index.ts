import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.js';
import visitRoutes from './routes/visits.js';
import { initBirthdayCron } from './cron/birthdays.js';

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = ['http://localhost:5173']; // Add your production and local URLs

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // If you use cookies or authorization headers
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/visits', visitRoutes);

// Start cron jobs
initBirthdayCron();

app.get('/', (req, res) => {
  res.send('El API de Burger Loyalty está funcionando con éxito');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
