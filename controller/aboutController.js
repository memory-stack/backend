const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

module.exports = {
  setAbout: async (req, res) => {
    try {
      let authToken = req.header("Authorization");
      authToken = authToken.substr(7, authToken.length);

      const decodedToken = jwt.verify(authToken, process.env.JWT_ACC_ACTIVATE1);
      const { username } = decodedToken;

      const about = req.body.about.trim();
      if (about == undefined || about.length === 0) {
        throw "No about received";
      }
      const user = await User.findOne({ username: username });
      user.about = about;
      await user.save();
      return res.json({ success: true, message: "About updated" });
    } catch (error) {
      console.error(error);
      return res.json({ success: false, message: error });
    }
  },

  about: async (req, res) => {
    try {
      let authToken = req.header("Authorization");
      authToken = authToken.substr(7, authToken.length);

      const decodedToken = jwt.verify(authToken, process.env.JWT_ACC_ACTIVATE1);
      const { username } = decodedToken;

      const user = await User.findOne({ username: username }, { about: 1 });
      console.log(user);
      return res.json({ success: true ,about:user.about});
    } catch (error) {
      console.error(error);
      return res.json({ success: false, message: error });
    }
  },
};
