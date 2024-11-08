const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const BlacklistedToken = require('../models/BlacklistedToken');

const adminAuthMiddleware = async (req, res, next) => {
    const token = req.headers['x-admin-token'];

    if (!token) {
        return res.status(401).json({ message: "Admin not authenticated" });
    }

    const blacklisted = await BlacklistedToken.findOne({ token });
    if (blacklisted) {
        return res.status(401).json({ message: "Token is blacklisted. Please log in again." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id);

        if (!admin) {
            return res.status(401).json({ message: "Authorization denied. Admin not found." });
        }

        req.admin = admin;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token is invalid. Please log in again." });
    }
};


module.exports = adminAuthMiddleware;
