const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      default: "",
    },
    createdThoughts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    createdLogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Log",
      },
    ],
    rank: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
