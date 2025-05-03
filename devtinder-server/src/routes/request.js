const express = require("express")
const validateUser = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")
const { validateConnectionRequest } = require("../utils/validation")
const router = express.Router()

router.post(
  "/request/send/:status/:toUserId",
  validateUser,
  async (req, res) => {
    try {
      const fromUserId = req.user._id
      const toUserId = req.params.toUserId
      const status = req.params.status
      
      // Validate connection request parameters
      validateConnectionRequest(fromUserId, toUserId, status)
      
      // Check if request already exists
      const existingRequest = await ConnectionRequest.findOne({
        fromUserId,
        toUserId
      })
      
      if (existingRequest) {
        return res.status(409).json({ message: "Connection request already exists" })
      }
      
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      })
      
      await connectionRequest.save()
      res.status(200).json({ message: "Connection request sent successfully" })
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ message: "Connection request already exists" })
      }
      res.status(400).json({ message: err.message })
    }
  }
)

router.post(
  "/request/review/:status/:requestId",
  validateUser,
  async (req, res) => {
    try {
      const loggedInUser = req.user
      const status = req.params.status
      const requestId = req.params.requestId

      const allowedStatuses = ["accepted", "rejected"]
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" })
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      })
      if (!connectionRequest) {
        return res.status(404).json({ message: "Request not found" })
      }
      connectionRequest.status = status

      const data = await connectionRequest.save()
      res.status(200).json({
        message: `Connection request ${status} successfully`,
        data,
      })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }
)

module.exports = router
