require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = function checkApiToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};