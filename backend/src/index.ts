import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.js';
import visitRoutes from './routes/visits.js';
import { initBirthdayCron } from './cron/birthdays.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
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
