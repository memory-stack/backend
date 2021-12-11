const mongoose = require("mongoose");

const logCreationDateSchema = new mongoose.Schema({
  localCreationDate: {
    type: Date,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("LogCreationDate", logCreationDateSchema);
