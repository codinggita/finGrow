import mongoose from 'mongoose';
import UserProfile from '../models/UserProfile.js';

// In-memory mock DB in case MongoDB is not connected
let mockProfile = {
    userId: 'mock_user_123',
    fullName: 'Alex Developer',
    email: 'alex@example.com',
    profilePicture: '',
    monthlyIncome: 100000,
    savings: 25000,
    riskAppetite: 'Medium',
    investmentGoals: ['Wealth Growth', 'Retirement']
};

export const getProfile = async (req, res) => {
    try {
        let profile;
        try {
            if (mongoose.connection.readyState !== 1) {
                throw new Error('DB not connected');
            }
            profile = await UserProfile.findOne({ userId: req.user.id });
        } catch (e) {
            // DB not connected, use mock
            return res.status(200).json(mockProfile);
        }

        if (!profile) {
            profile = new UserProfile({
                userId: req.user.id,
                fullName: req.user.name || 'User',
                email: req.user.email || 'user@example.com',
                monthlyIncome: 50000,
                savings: 10000,
                riskAppetite: 'Medium',
                investmentGoals: ['Wealth Growth']
            });
            await profile.save();
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server Error fetching profile' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullName, profilePicture, monthlyIncome, savings, riskAppetite, investmentGoals } = req.body;
        
        let inc = monthlyIncome !== undefined ? Number(monthlyIncome) : undefined;
        let sav = savings !== undefined ? Number(savings) : undefined;
        
        // Validations
        if (inc !== undefined && inc <= 0) {
            return res.status(400).json({ message: 'Income must be greater than 0' });
        }

        let profile;
        try {
            if (mongoose.connection.readyState !== 1) {
                throw new Error('DB not connected');
            }
            profile = await UserProfile.findOne({ userId: req.user.id });
            if (!profile) {
                profile = new UserProfile({ userId: req.user.id, email: req.user.email });
            }
        } catch (e) {
            // DB not connected, update mock
            if (fullName) mockProfile.fullName = fullName;
            if (profilePicture !== undefined) mockProfile.profilePicture = profilePicture;
            if (inc !== undefined) mockProfile.monthlyIncome = inc;
            if (sav !== undefined) mockProfile.savings = sav;
            if (riskAppetite) mockProfile.riskAppetite = riskAppetite;
            if (investmentGoals) mockProfile.investmentGoals = investmentGoals;
            return res.status(200).json(mockProfile);
        }

        if (fullName) profile.fullName = fullName;
        if (profilePicture !== undefined) profile.profilePicture = profilePicture;
        if (inc !== undefined) profile.monthlyIncome = inc;
        if (sav !== undefined) profile.savings = sav;
        if (riskAppetite) profile.riskAppetite = riskAppetite;
        if (investmentGoals) profile.investmentGoals = investmentGoals;

        await profile.save();
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server Error updating profile' });
    }
};
