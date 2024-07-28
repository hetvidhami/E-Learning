import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import instituteUser from '../models/instituteSchema.js';

dotenv.config();

const app = express();
app.use(bodyParser.json());

const router = express.Router();
const otpCache = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); 
};

router.get('/check-email/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await instituteUser.findOne({ email });
    res.status(200).json({ exists: !!user });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/send-otp', async (req, res) => {
  const { email, role } = req.body;

  try {
    const existingUser = await instituteUser.findOne({ email, role });
    if (existingUser) {
      return res.status(400).json({ message: 'User with the same email and role already exists' });
    }

    const otp = generateOTP();
    otpCache[email] = otp;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Verification',
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log('OTP sent to:', email);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (otpCache[email] && otpCache[email] == otp) {
      delete otpCache[email];
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
