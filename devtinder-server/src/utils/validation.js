const validator = require("validator")

const validateSignUp = (userData) => {
  const { emailId, password, firstName } = userData
  if (!emailId || !password || !firstName) {
    throw new Error("Please enter all the details")
  }
  if (validator.isStrongPassword(password) === false) {
    throw new Error("Please use a strong password")
  }
}

module.exports = {
  validateSignUp,
}
