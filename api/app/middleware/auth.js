const jwt = require('jsonwebtoken');

const authMiddleware = (config) => {
    return (req, res, next) => {
        const token = req.cookies.token;
        // console.log("Auth middleware invoked, token:", token);
        if (!token) {
            return res.status(401).json({ message: 'Access denied' });
        }
        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            req.user = decoded;
            next();
        } catch (err) {
            res.status(401).json({ message: 'Invalid token' });
        }
    };
};

module.exports = authMiddleware;