const Admin = require("../models/admin");
const { sendVerificationEmail } = require("../utils/adminVerificationCode");
const { generateTokenAdmin } = require("../utils/generateToken");
const BlacklistedToken = require('../models/BlacklistedToken');

exports.registerAdmin = async (req, res) => {
  try {
    const { email, password, confirmPassword, fullName, secretCode } = req.body;

    if (secretCode !== process.env.SECRET_CODE) {
      return res.status(400).json({ message: "Invalid code" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationCodeExpiry = Date.now() + 60000;
    const newAdmin = new Admin({
      email,
      password,
      fullName,
      verificationCode,
      verificationCodeExpiry,
    });

    await newAdmin.save();

    await sendVerificationEmail(
      process.env.EMAIL_USER,
      email,
      verificationCode,
      "email-verification",
      fullName
    );

    res.status(200).json({
      message:
        "Registration successful. Please ask the admin to check their email for the verification code.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    if (admin.isVerified) {
      return res.status(400).json({ message: "Admin is already verified" });
    }

    if (admin.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (Date.now() > admin.verificationCodeExpiry) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    admin.isVerified = true;
    admin.verificationCode = undefined;
    admin.verificationCodeExpiry = undefined;

    await admin.save();

    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!admin.isVerified) {
      return res.status(401).json({ message: "Email not verified." });
    }

    const token = generateTokenAdmin(admin);
    res.status(200).json({
      message: "Login successful",
      token, 
      admin: {
        id: admin._id,
        email: admin.email,
        fullName: admin.fullName,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.logoutAdmin = async (req, res) => {
  try {
      const token = req.headers['x-admin-token'];

      if (!token) {
          return res.status(401).json({ message: "Admin not authenticated" });
      }

      await BlacklistedToken.create({ token });

      res.status(200).json({ message: "Admin logged out successfully." });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


