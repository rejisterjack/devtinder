// Environment variables configuration
require('dotenv').config()

const config = {
  // In production, these would come from process.env
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV,

  // Cookie settings
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production
    sameSite: 'strict',
    maxAge: 48 * 60 * 60 * 1000, // 48 hours in milliseconds
  },
}

module.exports = config
