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

exports.sendVerificationEmail = async (
  adminEmail,
  userEmail,
  token,
  type,
  fullName
) => {
  try {
    let subject, text, html;

    if (type === "email-verification") {
      subject = "Admin Add Email Verification";
      text = `Admin Name ${fullName},\n\nVerification code: ${token}\n\nUser email: ${userEmail}\n\nDon't share this code with anyone,\n\nThank you!`;
      html = `<p>Admin Name <strong>${fullName}</strong>,</p>
                      <p>Verification code: <strong>${token}</strong></p>
                      <p>User email: <strong>${userEmail}</strong></p>
                      <p>Don't share this code with anyone.</p>
                      <p>Thank you!</p>`;
    } else {
      throw new Error("Unknown email type");
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    // console.log(`${subject} email sent to:`, adminEmail);
  } catch (error) {
    // console.error("Error sending email:", error);
    throw new Error("Could not send verification email.");
  }
};
