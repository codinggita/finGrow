export const calculateInvestmentRecommendation = (userData) => {
    const {
        monthlyIncome,
        monthlyExpenses,
        currentSavings,
        riskAppetite, // 'Low', 'Medium', 'High'
        investmentDuration // 'Short-term', 'Long-term'
    } = userData;

    // 1. Core Logic Calculations
    const disposableIncome = monthlyIncome - monthlyExpenses;
    const savingsRate = (disposableIncome / monthlyIncome) * 100;
    const emergencyFundRequirement = monthlyExpenses * 6;

    // 2. Emergency Fund Check
    if (currentSavings < emergencyFundRequirement) {
        return {
            status: 'warning',
            message: 'Emergency fund not met. Prioritize saving at least 6 months of expenses before investing.',
            calculations: {
                disposableIncome,
                savingsRate: savingsRate.toFixed(2),
                emergencyFundRequirement,
                currentSavings,
                shortfall: emergencyFundRequirement - currentSavings
            },
            recommendation: {
                profile: 'Safety First',
                allocation: [
                    { asset: 'High-Yield Savings Account (HYSA)', percentage: 70 },
                    { asset: 'Liquid Mutual Funds', percentage: 30 }
                ]
            },
            expectedReturn: '4-6% annually'
        };
    }

    // 3. Advanced Logic (Scoring Model)
    // Score based on savings rate, risk appetite, and duration
    const riskWeight = riskAppetite === 'High' ? 3 : riskAppetite === 'Medium' ? 2 : 1;
    const durationWeight = investmentDuration === 'Long-term' ? 2 : 1;
    
    // Base score calculation to gauge investment readiness/aggressiveness
    const investmentScore = (savingsRate * 0.5) + (riskWeight * 10) + (durationWeight * 10);

    // 4. Investment Recommendation Engine
    let recommendation = {};
    let expectedReturn = '';

    if (riskAppetite === 'Low') {
        recommendation = {
            profile: 'Conservative',
            allocation: [
                { asset: 'Fixed Deposits (FD)', percentage: 40 },
                { asset: 'Government Bonds', percentage: 40 },
                { asset: 'Debt Mutual Funds', percentage: 20 }
            ]
        };
        expectedReturn = '5-7% annually';
    } else if (riskAppetite === 'Medium') {
        recommendation = {
            profile: 'Balanced',
            allocation: [
                { asset: 'Index Funds', percentage: 50 },
                { asset: 'Hybrid Mutual Funds', percentage: 30 },
                { asset: 'Corporate Bonds', percentage: 20 }
            ]
        };
        expectedReturn = '8-12% annually';
    } else if (riskAppetite === 'High') {
        recommendation = {
            profile: 'Aggressive',
            allocation: [
                { asset: 'Direct Equity (Stocks)', percentage: 60 },
                { asset: 'Equity Mutual Funds / ETFs', percentage: 30 },
                { asset: 'Gold / Alternatives', percentage: 10 }
            ]
        };
        expectedReturn = '12-18% annually';
    }

    // Bonus feature: What if user increases savings by 10%?
    // Extra 10% of their current disposable income (savings amount)
    const extraSavings = disposableIncome * 0.10;
    // Assuming they invest this extra savings monthly at an 8% annual return for 10 years (Future Value of Series)
    const rate = 0.08 / 12; // monthly rate
    const periods = 10 * 12; // 10 years in months
    const futureValueOfExtra = extraSavings * ((Math.pow(1 + rate, periods) - 1) / rate);

    return {
        status: 'success',
        message: 'Emergency fund met! Here is your recommended portfolio based on your risk profile.',
        calculations: {
            disposableIncome,
            savingsRate: savingsRate.toFixed(2),
            emergencyFundRequirement,
            currentSavings,
            investmentScore: investmentScore.toFixed(2)
        },
        recommendation,
        expectedReturn,
        projections: {
            whatIf: `If you increase your monthly savings by 10% (an extra ₹${extraSavings.toFixed(0)}/month), investing it at 8% could yield an additional ₹${Math.round(futureValueOfExtra).toLocaleString()} in 10 years.`
        }
    };
};

export const fetchRealTimeData = async () => {
    // Mocking real-time market API to avoid external API key dependencies
    // In production, this would call Alpha Vantage or Yahoo Finance
    return {
        'Index Funds': { price: 450.25, trend: '+1.2%', symbol: 'VOO' },
        'Government Bonds': { price: 102.50, trend: '+0.1%', symbol: 'GOVT' },
        'Direct Equity (Stocks)': { price: 3250.75, trend: '-0.5%', symbol: 'AAPL/MSFT' },
        'Gold / Alternatives': { price: 2340.00, trend: '+0.8%', symbol: 'GLD' },
        'Fixed Deposits (FD)': { price: 100.00, trend: '0.0%', symbol: 'BANK' },
        'Debt Mutual Funds': { price: 25.10, trend: '+0.05%', symbol: 'BND' },
        'Hybrid Mutual Funds': { price: 45.80, trend: '+0.4%', symbol: 'VBINX' },
        'Corporate Bonds': { price: 105.20, trend: '+0.15%', symbol: 'LQD' },
        'Equity Mutual Funds / ETFs': { price: 120.50, trend: '+1.0%', symbol: 'QQQ' }
    };
};
