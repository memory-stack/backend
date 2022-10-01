//log model
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  logMessage: {
    type: String,
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
  localCreationDate:{
    type:Date,
    required:true,
  },
  localCreationTime:{
    type:String,
    required:true,
  }
});

module.exports = mongoose.model("Log", logSchema);
