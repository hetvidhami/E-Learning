const express = require('express');
const router = express.Router();
const { signup, verifyOTP } = require('../controllers/verifyControllers');

// Route to handle user signup and email verification
router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);

module.exports = router;
