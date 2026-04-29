import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    profilePicture: { type: String, default: '' }, // We will store Base64 string for simplicity without Cloudinary
    monthlyIncome: { type: Number, default: 0 },
    savings: { type: Number, default: 0 },
    riskAppetite: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    investmentGoals: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.model('UserProfile', userProfileSchema);
