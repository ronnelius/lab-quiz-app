import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const JWT_SECRET = 'your_jwt_secret_here';

export default async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false, 
            message: 'Unauthorized Access, token missing' });
    }

    const token = authHeader.split(' ')[1];

    // Verify Token
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.id).select('-password');
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'User Not Found' });
        }
        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('JWT VERIFICATION ERROR:', err);
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid Token' });

    }
}