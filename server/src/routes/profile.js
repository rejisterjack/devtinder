const express = require("express")
const User = require("../models/user")
const validateUser = require("../middlewares/auth")
const router = express.Router()

router.get("/", validateUser, async (req, res) => {
  try {
    const user = req.user
    res.status(200).json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get("/user-by-email", async (req, res) => {
  try {
    const user = await User.findOne({
      emailId: req.body.emailId,
    })
    if (!user) {
      return res.status(404).json({
        message: "No user found",
      })
    }
    res.status(200).json({
      user,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body.userId)
    res.status(200).json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.body.userId,
      { emailId: req.body.emailId },
      { new: true, runValidators: true }
    )
    res.status(200).json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch("/edit/:userId", validateUser, async (req, res)=>{
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, req.body)
    } catch (err) {}
})

module.exports = router
