// Entry point
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import investmentRoutes from './src/routes/investmentRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/investments', investmentRoutes);
app.use('/api/profile', profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
