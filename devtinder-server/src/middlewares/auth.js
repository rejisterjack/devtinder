const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../config/config')

const validateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const decoded = jwt.verify(token, config.JWT_SECRET)
    if (!decoded._id) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    const user = await User.findById(decoded._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    req.user = user
    next()
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }

    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = validateUser
