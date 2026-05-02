import express from 'express';
import { getInvestmentRecommendations } from '../controllers/investmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/investments/recommend
router.post('/recommend', protect, getInvestmentRecommendations);

export default router;
