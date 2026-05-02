// Entry point
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './src/config/db.js';
import investmentRoutes from './src/routes/investmentRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import expenseRoutes from './src/routes/expenseRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import budgetRoutes from './src/routes/budgetRoutes.js';
import analyticsRoutes from './src/routes/analyticsRoutes.js';
import recurringRoutes from './src/routes/recurringRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors({
  origin: '*', // Allows all domains. For production, you could restrict this to your Vercel URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/investments', investmentRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/recurring', recurringRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
