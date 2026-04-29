import express from 'express';
import { getInvestmentRecommendations } from '../controllers/investmentController.js';

const router = express.Router();

// POST /api/investments/recommend
router.post('/recommend', getInvestmentRecommendations);

export default router;
