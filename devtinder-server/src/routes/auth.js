const express = require('express')
const { validateSignUp } = require('../utils/validation')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const router = express.Router()

router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', req.body)
    
    // Check if request body has the expected structure
    if (!req.body.user) {
      return res.status(400).json({ 
        message: 'Invalid request format. Expected { user: {...} }' 
      })
    }
    
    validateSignUp(req.body.user)
    const userObj = req.body.user

    // Check if user already exists
    const existingUser = await User.findOne({ emailId: userObj.emailId })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' })
    }

    const user = new User({
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      emailId: userObj.emailId,
      password: userObj.password, // Model will hash this in pre-save hook
      age: userObj.age,
      gender: userObj.gender,
    })

    await user.save()

    // Generate token for auto login after signup
    const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: '2 days',
    })

    res.cookie('token', token, config.COOKIE_OPTIONS)

    res.status(201).json({
      message: 'User created successfully',
      userId: user._id,
    })
  } catch (err) {
    console.error('Signup error:', err)
    
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email already in use' })
    }
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: err.message 
      })
    }
    
    res.status(400).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    if (!req.body.emailId || !req.body.password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ emailId: req.body.emailId })
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
      })
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials',
      })
    }

    const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: '2 days',
    })

    res.cookie('token', token, config.COOKIE_OPTIONS)

    res.status(200).json({
      message: 'User logged in successfully',
      userId: user._id,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/logout', async (req, res) => {
  res
    .clearCookie('token', {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    .status(200)
    .json({ message: 'Logged out successfully' })
})

module.exports = router
