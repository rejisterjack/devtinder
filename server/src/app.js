const express = require("express")
const connectDB = require("./config/database")
const User = require("./models/user")
const app = express()

app.use(express.json())

const Port = process.env.PORT || 8000

app.get("/", (req, res) => {
  res.send("DevTinder is up!")
})

app.post("/signup", async (req, res) => {
  try {
    const userObj = req.body.user
    const user = new User(userObj) // creating a new instance of the model User
    await user
      .save()
      .then(() => {
        res.status(200).send("user added successfully")
      })
      .catch((err) => {
        res.status(500).send(err.message)
      })
  } catch (err) {
    res.status(500).send(err.message)
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
    res.status(500).send(err.message)
  }
})

app.delete("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body.userId)
    res.status(200).json({ user })
  } catch (err) {
    res.status(500).send(err.message)
  }
})

app.patch("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.body.userId,
      { emailId: req.body.emailId },
      { new: true }
    )
    res.status(200).json({ user })
  } catch (err) {
    res.status(500).send(err.message)
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
