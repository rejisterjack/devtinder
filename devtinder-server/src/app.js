const express = require('express')
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser')
const config = require('./config/config')
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
const userRouter = require('./routes/user')
require("./utils/cronjob"); // Initialize cron jobs

// Initialize app
const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())

// CORS middleware for development
if (config.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    )
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200)
    }
    next()
  })
}

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'DevTinder API is up and running!' })
})

// Routes
app.use('/auth', authRouter)
app.use('/profile', profileRouter)
app.use('/api', userRouter) // Added the user routes
app.use('/api', requestRouter)

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    ...(config.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// Initialize server
const startServer = async () => {
  try {
    await connectDB()
    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Start server
startServer()
