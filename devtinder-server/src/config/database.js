const mongoose = require('mongoose')
const config = require('./config')

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      // These options are no longer needed in mongoose 6+, but kept for clarity
    })
    console.log('MongoDB Connected Successfully!')
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message)
    process.exit(1) // Exit on database connection failure
  }
}

module.exports = connectDB
