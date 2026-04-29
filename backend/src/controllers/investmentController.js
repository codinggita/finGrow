import { calculateInvestmentRecommendation, fetchRealTimeData } from '../services/investmentService.js';

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

        return res.status(200).json(recommendationResult);
    } catch (error) {
        console.error('Error generating investment recommendation:', error);
        return res.status(500).json({ error: 'Server error while generating recommendations' });
    }
};
