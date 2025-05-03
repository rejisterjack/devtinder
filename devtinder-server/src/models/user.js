const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const config = require('../config/config')

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: [3, "First name must be at least 3 characters long"],
      maxLength: 50,
      required: true
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email")
        }
      },
    },
    password: {
      type: String,
      required: true
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

userSchema.index({ emailId: 1 }, { unique: true })

userSchema.pre("save", async function (next) {
  const user = this

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

userSchema.methods.getJWT = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
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
