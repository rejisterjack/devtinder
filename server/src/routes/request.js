const express = require("express")
const validateUser = require("../middlewares/auth")
const router = express.Router()

router.post("/sendConnectionRequest", validateUser, async (req, res) => {
  const user = req.user
  console.log("sending a connection request")
  res.send(user.firstName + "send the connect request")
})

module.exports = router
