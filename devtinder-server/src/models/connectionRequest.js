const { Schema } = require("mongoose")

const ConnectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: "{VALUE} is not a valid status",
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

ConnectionRequest.pre("save", function (next) {
  const connectionRequest = this

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    const error = new Error("Cannot create a connection request to yourself")
    return next(error)
  }

  next()
})

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  ConnectionRequestSchema
)

module.exports = ConnectionRequest
