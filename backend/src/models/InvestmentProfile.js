import mongoose from 'mongoose';

const investmentProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    monthlyIncome: { type: Number, required: true },
    monthlyExpenses: { type: Number, required: true },
    currentSavings: { type: Number, required: true },
    riskAppetite: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    investmentDuration: { type: String, enum: ['Short-term', 'Long-term'], required: true },
    recommendation: { type: Object } // Store the generated recommendation
}, { timestamps: true });

export default mongoose.model('InvestmentProfile', investmentProfileSchema);
