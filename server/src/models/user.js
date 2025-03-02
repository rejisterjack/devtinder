const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: [3, "First name must be at least 3 characters long"],
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      unique: true,
      trim: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email")
        }
      },
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.methods.getJWT = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id }, "secretkey", {
    expiresIn: "7d",
  })
  return token
}

userSchema.methods.verifyPassword = async function (password) {
  const user = this
  const isMatch = bcrypt.compare(password, user.password)
  return isMatch
}

const User = mongoose.model("User", userSchema)
module.exports = User
