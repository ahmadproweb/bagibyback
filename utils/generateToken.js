const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
    );
};

const generateTokenAdmin = (admin) => {
    return jwt.sign(
        { id: admin._id, email: admin.email },
        process.env.JWT_SECRET,
    );
};

module.exports = { generateToken, generateTokenAdmin };
