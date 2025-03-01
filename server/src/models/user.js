const mongoose = require("mongoose")

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

const User = mongoose.model("User", userSchema)
module.exports = User
