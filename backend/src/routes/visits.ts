import express from 'express';
import { prisma } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';
import { recordVisit } from '../services/visitService.js';

const router = express.Router();

// Get user visits and coupons profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { visits: true, redemptions: true }
    });
    if (!user) return res.status(404).json({ error: 'No encontramos al usuario' });
    
    // We send back the user profile omitting sensitive data
    const { email, firstName, lastName, dob, visits, redemptions, isAdmin } = user;
    res.json({ email, firstName, lastName, dob, visits, redemptions, isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor' });
  }
});

// Endpoint to scan QR and add a visit
router.post('/scan', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { code } = req.body;
    console.log(`[SCAN] User ${userId} scanning code: ${code || 'NO_CODE'}`);
    
    const result = await recordVisit(userId, code);
    
    if ('error' in result) {
      console.warn(`[SCAN] Error for user ${userId}: ${result.error}`);
      return res.status(400).json({ error: result.error });
    }

    console.log(`[SCAN] Success for user ${userId}:`, result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor' });
  }
});

export default router;
