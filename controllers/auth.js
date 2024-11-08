const User = require('../models/auth');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { sendVerificationEmail } = require('../utils/emailVerification.js');
const {generateToken} = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/BlacklistedToken');

exports.registerUser = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            if (existingUser.isVerified) {
                return res.status(400).json({ message: "An account with this email already exists." });
            } else {
                const verificationToken = crypto.randomBytes(32).toString('hex');
                existingUser.verificationCode = verificationToken;
                existingUser.verificationCodeExpiry = Date.now() + 3600000; 
                await existingUser.save();
        
                const verificationLink = `${process.env.WEBSITE_URL}/verify-email?token=${verificationToken}`;
                await sendVerificationEmail(email, verificationLink, 'email-verification');
        
                return res.status(400).json({ message: "A new verification link has been sent to your email." });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiry = Date.now() + 3600000;

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            verificationCode: verificationToken,
            verificationCodeExpiry: verificationTokenExpiry,
        });

        await newUser.save();

        const verificationLink = `${process.env.WEBSITE_URL}/verify-email?token=${verificationToken}`;
        await sendVerificationEmail(email, verificationLink, 'email-verification');

        res.status(201).json({ message: "User registered. Please verify your email via the link sent." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: "Please verify your email first, then log in." });
        }

        const token = generateToken(user);

  
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            path: '/',
        });
        
        res.status(200).json({ 
            message: "Login successful", 
            user: { id: user._id, fullName: user.fullName, email: user.email, profileImage: user.profileImage }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.verifyEmailToken = async (req, res) => {
    try {
        const { token } = req.query; 
        // console.log("Request URL:", req.url);
        // console.log("Received token for verification:", token); 

        if (!token) {
            // console.log("Error: Token is missing.");
            return res.status(400).json({ message: "Token is missing." });
        }

        const user = await User.findOne({
            verificationCode: token,
            verificationCodeExpiry: { $gt: Date.now() },
        });

        // if (!user) {
        //     console.log("Verification failed: No user found or token expired");
        //     return res.status(400).json({ message: "Invalid or expired verification link" });
        // }

        user.isVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpiry = null;
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        // console.error("Verification error:", error);
        res.status(500).json({ error: error.message });
    }
};
exports.isAuthenticated = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ isAuthenticated: false });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        return res.status(200).json({ isAuthenticated: true, userId: decoded.id });
    } catch (error) {
        return res.status(401).json({ isAuthenticated: false });
    }
};
exports.logoutUser = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        await BlacklistedToken.create({ token });

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; 

        await user.save();

        const resetLink = `${process.env.WEBSITE_URL}/reset-password?token=${resetToken}`;
        await sendVerificationEmail(email, resetLink, 'password-reset');

        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        // console.error('Error requesting password reset:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.resetPassword = async (req, res) => {
    const { resetToken, newPassword, confirmPassword } = req.body;
    try {
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const user = await User.findOne({ resetToken, resetTokenExpiry: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        const isMatch = await bcrypt.compare(newPassword, user.password);
        if (isMatch) {
            return res.status(400).json({ message: 'New password cannot be the same as the old password. Please choose a different password.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        // console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



  

exports.getAllUsers = async (req, res) => {
    const token = req.headers['x-admin-token']; 

    if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const users = await User.find().sort({ createdAt: -1 });
        // console.log("Fetched users:", users); 
        return res.status(200).json(users);
    } catch (error) {
        // console.error("Error fetching users:", error);
        return res.status(500).json({ error: error.message });
    }
};





