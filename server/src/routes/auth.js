const express = require("express")
const { validateSignUp } = require("../utils/validation")
const router = express.Router()

router.post("/signup", async (req, res) => {
  try {
    validateSignUp(req.body.user)
    const userObj = req.body.user

    const hashedPassword = await bcrypt.hash(userObj.password, 8)

    const user = new User({
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      emailId: userObj.emailId,
      password: hashedPassword,
      age: userObj.age,
      gender: userObj.gender,
    }) // creating a new instance of the model User

    await user
      .save()
      .then(() => {
        res.status(200).send("user added successfully")
      })
      .catch((err) => {
        res.status(500).json({ message: err.message })
      })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId })
    if (!user) {
      return res.status(404).json({
        message: "Invalid credentials", // to avoid giving hints to the user, we are sending the same message for both cases, preventing data leakage
      })
    } else {
      const isMatch = await bcrypt.compare(req.body.password, user.password)
      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid credentials",
        })
      }
      const token = await jwt.sign({ _id: user._id }, "secretkey", {
        expiresIn: "2 days",
      })
      res.cookie("token", token)
      res.status(200).json({
        message: "User logged in successfully",
      })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send()
})

module.exports = router
