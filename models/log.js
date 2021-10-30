const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    logMessage: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", logSchema);
