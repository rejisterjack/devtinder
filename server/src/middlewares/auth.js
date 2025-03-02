const jwt = require("jsonwebtoken")
const User = require("../models/user")

const validateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    const userId = await jwt.verify(token, "secretkey")
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    req.user = user
    next()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = validateUser
