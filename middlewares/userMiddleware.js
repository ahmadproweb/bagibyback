const jwt = require('jsonwebtoken');
const User = require('../models/auth');
const BlacklistedToken = require('../models/BlacklistedToken');

const userAuthMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const blacklisted = await BlacklistedToken.findOne({ token });
    if (blacklisted) {
        return res.status(401).json({ message: "Token is blacklisted. Please log in again." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Authorization denied. User not found." });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token is invalid. Please log in again." });
    }
};


module.exports = userAuthMiddleware;
