const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const token = req.headers.authorization?.split(' ')[1]; // Handle Bearer token format

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: Missing token' });
        }

        // Verify token using a robust secret management strategy:
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized: Invalid token' });
            }

            // Retrieve user from database based on decoded user ID:
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized: User not found' });
            }

            // Attach authenticated user to request object for authorization checks:
            req.user = user;

            next(); 
        });
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = authenticate;
