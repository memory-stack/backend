const User = require("../models/user.js");
const Thought = require("../models/thought");
const jwt = require("jsonwebtoken");

module.exports = {
  setThought: async (req, res) => {
    try {
      let authToken = req.header("Authorization");
      authToken = authToken.substr(7, authToken.length);

      let decodedToken = jwt.verify(authToken, process.env.JWT_ACC_ACTIVATE1);
      const { email, username } = decodedToken;
      const newThought = req.body.thought;

      if (newThought == undefined || newThought.length === 0) {
        throw "No thought received";
      }

      const creator = await User.findOne({ email: email });
      const thought = new Thought({
        thought: newThought,
        creator: creator._doc._id,
      });

      await thought.save();
      creator.createdThoughts.push(thought);
      await creator.save();
      const thoughtNumber = creator.createdThoughts.length;
      return res.json({
        success: true,
        message: "Added thought",
        thoughtNumber: thoughtNumber,
      });
    } catch (error) {
      console.error(error);
      return res.json({ success: false, message: error });
    }
  },

  allThought: async (req, res) => {
    try {
      let authToken = req.header("Authorization");
      authToken = authToken.substr(7, authToken.length);

      let decodedToken = jwt.verify(authToken, process.env.JWT_ACC_ACTIVATE1);
      const username = req.params.username;

      const result = await User.findOne({ username: username }).populate(
        "createdThoughts"
      );

      const thoughts = [...result["createdThoughts"]];

      return res.json({ success: true, result: thoughts });
    } catch (error) {
      console.error(error);
      return res.json({ success: false, message: error });
    }
  },
};
