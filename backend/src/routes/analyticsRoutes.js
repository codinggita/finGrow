import express from 'express';
import { getSpendingTrend, getCategoryDistribution, getEfficiencyScore } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/spending-trend', protect, getSpendingTrend);
router.get('/category-distribution', protect, getCategoryDistribution);
router.get('/efficiency-score', protect, getEfficiencyScore);

export default router;
