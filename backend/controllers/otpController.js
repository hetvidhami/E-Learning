const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { default: instituteUser } = require('../models/instituteSchema');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

exports.sendOtp = async (req, res) => {
  const { email, role } = req.body; // Assuming role is passed in the request body
  const otp = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
  const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

  try {
    const existingUser = await instituteUser.findOne({ email, role });
    if (existingUser) {
      return res.status(400).json({ message: 'User with the same email and role already exists' });
    }

    const user = await instituteUser.findOneAndUpdate({
      email,
      password: req.body.password,
      role,
      otp,
      otpExpires,
  });

    sendOTPEmail(email, otp.toString()); 
    res.status(200).json({ otp }); 
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await instituteUser.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
    }

    // Clear OTP and otpExpires after verification (optional for your use case)
    await instituteUser.findOneAndUpdate(
      { email },
      { $unset: { otp: '', otpExpires: '' } }
    );

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

