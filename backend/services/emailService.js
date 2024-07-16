import nodemailer from 'nodemailer';

// Function to generate a random 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send verification email
export const sendVerificationEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hetvidhami1312@gmail.com', // Your email
      pass: 'xlaw fetj rjmr njpx'       // Your email password
    }
  });

  const mailOptions = {
    from: 'hetvidhami1312@gmail.com',
    to: email,
    subject: 'Verify Your Email',
    html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
  };

  await transporter.sendMail(mailOptions);
};
