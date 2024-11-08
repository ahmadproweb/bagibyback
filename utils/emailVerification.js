const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", 
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendVerificationEmail = async (email, link, type) => {
  try {
    let subject, text, html;

    if (type === "email-verification") {  
      subject = "Email Verification";
      text = `Verify your email using the following link: ${link}`;
      html = `<p>Verify your email using the following link: <a href="${link}">Verify Email</a></p>`;
    } else if (type === "password-reset") {
      subject = "Password Reset";
      text = `Reset your password using the following link: ${link}`;
      html = `<p>Reset your password using the following link: <a href="${link}">Reset Password</a></p>`;
    } else {
      throw new Error("Unknown email type");
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    // console.log(`${subject} email sent to:`, email);
  } catch (error) {
    // console.error("Error sending email:", error);
    throw new Error("Could not send verification email.");
  }
};

