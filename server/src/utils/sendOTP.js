const nodemailer = require("nodemailer");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, code) => {
  await transporter.sendMail({
    from: `"Generator System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Баталгаажуулах код",
    text: `Таны баталгаажуулах код: ${code}`,
  });
};

module.exports = { generateOTP, sendOTP };