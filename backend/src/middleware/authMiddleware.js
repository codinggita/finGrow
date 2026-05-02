import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // For testing/mocking without a real login flow right now
    if (!token || token === 'mock_token') {
        req.user = { id: '507f1f77bcf86cd799439011', name: 'Alex Developer', email: 'alex@example.com' };
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
