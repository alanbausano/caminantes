import express from 'express';
import { prisma } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get user visits and coupons profile
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { visits: true, coupons: true }
    });
    if (!user) return res.status(404).json({ error: 'No encontramos al usuario' });
    
    // We send back the user profile omitting sensitive data
    const { email, firstName, lastName, phone, dob, visits, coupons } = user;
    res.json({ email, firstName, lastName, phone, dob, visits, coupons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor' });
  }
});

// Endpoint to scan QR and add a visit
router.post('/scan', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    // For MVP, just recording a visit
    // Can add cooldown logic (e.g., max 1 visit per day) here

    const lastVisit = await prisma.visit.findFirst({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });

    if (lastVisit) {
      const hoursSinceLastVisit = (new Date().getTime() - new Date(lastVisit.timestamp).getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastVisit < 12) {
        return res.status(400).json({ error: 'Solo podés sumar una visita cada 12 horas.' });
      }
    }

    const newVisit = await prisma.visit.create({
      data: { userId }
    });
    
    // Check if the user reached 10 visits (or a multiple of 10)
    const totalVisits = await prisma.visit.count({ where: { userId } });
    let newCoupon = null;
    
    if (totalVisits > 0 && totalVisits % 10 === 0) {
      // Award a coupon
      newCoupon = await prisma.coupon.create({
        data: { userId }
      });
    }

    res.json({ newVisit, totalVisits, newCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor' });
  }
});

export default router;
