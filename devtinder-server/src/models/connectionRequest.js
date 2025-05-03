const mongoose = require('mongoose')
const { Schema } = mongoose

const ConnectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['ignore', 'interested', 'accepted', 'rejected'],
        message: '{VALUE} is not a valid status',
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true })

ConnectionRequestSchema.pre('save', function (next) {
  const connectionRequest = this

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    const error = new Error('Cannot create a connection request to yourself')
    return next(error)
  }

  next()
})

const ConnectionRequest = mongoose.model(
  'ConnectionRequest',
  ConnectionRequestSchema
)

module.exports = ConnectionRequest
