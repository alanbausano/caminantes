import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/admin.js';
import { createRedemptionRequest, getPendingRedemptions, getCompletedRedemptions, completeRedemption } from '../services/redemptionService.js';

const router = Router();

// User scans for redemption
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const redemption = await createRedemptionRequest(userId);
    res.status(201).json(redemption);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Admin views pending redemptions
router.get('/admin/pending', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    const redemptions = await getPendingRedemptions();
    res.json(redemptions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin views completed redemptions
router.get('/admin/completed', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    const redemptions = await getCompletedRedemptions();
    res.json(redemptions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin completes redemption
router.post('/admin/:id/complete', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    const id = req.params.id as string;
    const completed = await completeRedemption(id);
    res.json(completed);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
