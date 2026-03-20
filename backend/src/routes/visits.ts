import express from 'express';
import { prisma } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';
import { recordVisit } from '../services/visitService.js';

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
    const result = await recordVisit(userId);
    
    if ('error' in result) {
      return res.status(400).json({ error: result.error });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor' });
  }
});

export default router;
