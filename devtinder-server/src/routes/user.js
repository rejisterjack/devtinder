const validateUser = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")

const router = require("express").Router()

router.get("/user/requests/received", validateUser, async (req, res) => {
  try {
    const connectionRequests = await ConnectionRequest.find({
      toUserId: req.user._id,
      status: "interested",
    }).populate("fromUserId", " firstName lastName emailId")

    res.status(200).json(connectionRequests)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/user/connections", validateUser, async (req, res) => {
  try {
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: req.user._id, status: "accepted" },
        { toUserId: req.user._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName emailId")
      .populate("toUserId", "firstName lastName emailId")

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === req.user._id.toString()) {
        return row.toUserId
      } else {
        return row.fromUserId
      }
    })

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
