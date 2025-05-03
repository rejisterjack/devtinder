// Environment variables configuration
const config = {
  // In production, these would come from process.env
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_key_change_in_production',
  PORT: process.env.PORT || 8000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/devtinder',
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Cookie settings
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production
    sameSite: 'strict',
    maxAge: 48 * 60 * 60 * 1000, // 48 hours in milliseconds
  },
}

module.exports = config
