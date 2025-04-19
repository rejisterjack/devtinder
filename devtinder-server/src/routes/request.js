const express = require("express")
const validateUser = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")
const router = express.Router()

router.post("/request/send/:status/:toUserId", validateUser, async (req, res) => {
  try {
    const connectionRequest = new ConnectionRequest({
      fromUserId: req.user._id,
      toUserId: req.params.toUserId,
      status: req.params.status,
    })
    await connectionRequest.save()
    res.status(200).json({ message: "Connection request sent successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
