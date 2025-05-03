const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/config');

exports.login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    
    // Trim whitespace and convert email to lowercase for consistent comparison
    const normalizedEmail = emailId.trim().toLowerCase();
    
    // Find user with case-insensitive email search
    const user = await User.findOne({ 
      emailId: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } 
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Use proper await for bcrypt compare
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: '24h',
    });

    // Set token as cookie
    res.cookie('token', token, config.COOKIE_OPTIONS);

    res.status(200).json({
      message: 'Login successful',
      userId: user._id,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};