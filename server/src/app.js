const express = require("express")
const connectDB = require("./config/database")
const User = require("./models/user")
const { validateSignUp } = require("./utils/validation")
const app = express()
const bcrypt = require("bcrypt")

app.use(express.json())

const Port = process.env.PORT || 8000

app.get("/", (req, res) => {
  res.send("DevTinder is up!")
})

app.post("/signup", async (req, res) => {
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

app.get("/user-by-email", async (req, res) => {
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

app.delete("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body.userId)
    res.status(200).json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.patch("/user", async (req, res) => {
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

connectDB()
  .then(() => {
    console.log("Database Connected Successfully!")

    app.listen(Port, () => {
      console.log("Server is running on port: " + Port)
    })
  })
  .catch(() => {
    console.log("Database Unable to Connect!")
  })
