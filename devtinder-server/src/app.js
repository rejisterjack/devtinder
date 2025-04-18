const express = require("express")
const connectDB = require("./config/database")
const User = require("./models/user")
const app = express()
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")

app.use(express.json())
app.use(cookieParser())

const Port = process.env.PORT || 8000

app.get("/", (req, res) => {
  res.send("DevTinder is up!")
})

app.use("/auth", authRouter)
app.use("/profile", profileRouter)
app.use("/request", requestRouter)

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
