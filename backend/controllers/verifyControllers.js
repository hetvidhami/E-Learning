import { generateOTP, sendVerificationEmail } from '../services/emailService.js';

export const registerUser = async (UserModel, req, res) => {
  const { role, email, password } = req.body;
  const userExists = await UserModel.findOne({ email, role });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const otp = generateOTP();
  const user = await UserModel.create({
    role,
    email,
    password,
    otp,
    isEmailVerified: false
  });

  if (user) {
    await sendVerificationEmail(email, otp);
    res.status(201).json({
      message: 'User created successfully, verification email sent',
      _id: user._id,
      email: user.email,
    });
  } else {
    res.status(400).json({ message: 'Invalid data' });
  }
};

export const loginUser = async (UserModel, req, res) => {
  const { email, password, role } = req.body;
  const user = await UserModel.findOne({ email });

  if (user && await user.matchPasswords(password) && user.role.toLowerCase() === role.toLowerCase()) {
    res.status(200).json({ message: "Login Successful", user: user });
  } else {
    res.status(401).json({ message: 'No user found' });
  }
};

export const verifyOTP = async (UserModel, req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP or email.' });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying OTP.' });
  }
};
