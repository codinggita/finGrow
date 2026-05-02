import { calculateInvestmentRecommendation, fetchRealTimeData } from '../services/investmentService.js';
import InvestmentProfile from '../models/InvestmentProfile.js';
import { createNotification } from './notificationController.js';

export const getInvestmentRecommendations = async (req, res) => {
    try {
        const { monthlyIncome, monthlyExpenses, currentSavings, riskAppetite, investmentDuration } = req.body;

        // Basic validation
        if (!monthlyIncome || !monthlyExpenses || riskAppetite == null) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const userData = {
            monthlyIncome: Number(monthlyIncome),
            monthlyExpenses: Number(monthlyExpenses),
            currentSavings: Number(currentSavings) || 0,
            riskAppetite, // 'Low', 'Medium', 'High'
            investmentDuration: investmentDuration || 'Long-term'
        };

        // Get recommendations based on logic
        const recommendationResult = calculateInvestmentRecommendation(userData);

        // Fetch real-time (mocked) market data to enrich the recommendation
        const marketData = await fetchRealTimeData();
        
        // Enrich the allocation with current market data prices
        if (recommendationResult.recommendation && recommendationResult.recommendation.allocation) {
            recommendationResult.recommendation.allocation = recommendationResult.recommendation.allocation.map(assetObj => {
                const marketInfo = marketData[assetObj.asset] || {};
                return { ...assetObj, ...marketInfo };
            });
        }

        // Save to Database if user is authenticated
        if (req.user && req.user.id) {
            const investmentProfile = new InvestmentProfile({
                userId: req.user.id,
                monthlyIncome: userData.monthlyIncome,
                monthlyExpenses: userData.monthlyExpenses,
                currentSavings: userData.currentSavings,
                riskAppetite: userData.riskAppetite,
                investmentDuration: userData.investmentDuration,
                recommendation: recommendationResult.recommendation
            });
            await investmentProfile.save();

            // Create notification
            await createNotification(
                req.user.id,
                'New investment recommendation generated based on your profile.',
                'info'
            );
        }

        return res.status(200).json(recommendationResult);
    } catch (error) {
        console.error('Error generating investment recommendation:', error);
        return res.status(500).json({ error: 'Server error while generating recommendations' });
    }
};
