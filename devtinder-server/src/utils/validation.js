const validator = require('validator')

const validateSignUp = (userData) => {
  const { emailId, password, firstName } = userData

  if (!emailId || !password || !firstName) {
    throw new Error('Please provide email, password and first name')
  }

  if (!validator.isEmail(emailId)) {
    throw new Error('Please provide a valid email address')
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      'Password must be at least 8 characters long and contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol'
    )
  }

  if (firstName.trim().length < 2) {
    throw new Error('First name must be at least 2 characters long')
  }
}

const validateConnectionRequest = (fromUserId, toUserId, status) => {
  if (!fromUserId || !toUserId) {
    throw new Error('Both user IDs are required')
  }

  if (fromUserId === toUserId) {
    throw new Error('Cannot create connection request to yourself')
  }

  const validStatuses = ['ignore', 'interested', 'accepted', 'rejected']
  if (status && !validStatuses.includes(status)) {
    throw new Error('Invalid status value')
  }
}

module.exports = {
  validateSignUp,
  validateConnectionRequest,
}
