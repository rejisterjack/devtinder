const express = require('express')
const User = require('../models/user')
const validateUser = require('../middlewares/auth')
const router = express.Router()

router.get('/', validateUser, async (req, res) => {
  try {
    const user = req.user
    res.status(200).json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/user-by-email', validateUser, async (req, res) => {
  try {
    const user = await User.findOne({
      emailId: req.body.emailId,
    })
    if (!user) {
      return res.status(404).json({
        message: 'No user found',
      })
    }
    res.status(200).json({
      user,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/user', validateUser, async (req, res) => {
  try {
    // Only allow users to delete themselves
    if (req.user._id.toString() !== req.body.userId) {
      return res.status(403).json({ message: 'Unauthorized action' })
    }

    const user = await User.findByIdAndDelete(req.body.userId)
    res.status(200).json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/user', validateUser, async (req, res) => {
  try {
    // Only allow users to update themselves
    if (req.user._id.toString() !== req.body.userId) {
      return res.status(403).json({ message: 'Unauthorized action' })
    }

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

router.patch('/edit/:userId', validateUser, async (req, res) => {
  try {
    // Check if the authenticated user is the same as the requested user to edit
    if (req.user._id.toString() !== req.params.userId) {
      return res
        .status(403)
        .json({ message: 'You can only edit your own profile' })
    }

    // Filter out fields that shouldn't be updated
    const updates = { ...req.body }
    const disallowedUpdates = ['password', '_id', 'emailId'] // Add fields that shouldn't be directly updated
    disallowedUpdates.forEach((field) => delete updates[field])

    const user = await User.findByIdAndUpdate(req.params.userId, updates, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
