const express = require("express")
const connectDB = require("./config/database")
const app = express()

const Port = process.env.PORT || 8000

connectDB()
  .then(() => {

    console.log("Database Connected Successfully!")
    
    app.use("/", (err, req, res, next) => {
      if (err) {
        res.status(500).send("Something broke!")
      }
    })

    app.listen(Port, () => {
      console.log("Server is running on port: " + Port)
    })
  })
  .catch(() => {
    console.log("Database Unable to Connect!")
  })
