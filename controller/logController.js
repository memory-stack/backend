const User = require("../models/user.js");
const Log = require("../models/log");
const jwt = require("jsonwebtoken");

module.exports = {
  displayLogs: async (req, res) => {
    try {
      let authToken = req.header("Authorization");
      authToken = authToken.substr(7, authToken.length);

      const decodedToken = jwt.verify(authToken, process.env.JWT_ACC_ACTIVATE1);
      const username = req.params.username;

      const result = await User.findOne({ username: username }).populate(
        "createdLogs"
      );

      const logs = [...result["createdLogs"]];

      return res.json({ success: true, result: logs });
    } catch (error) {
      console.error(error);
      return res.json({ success: false, message: error });
    }
  },

  createLog: async (req, res) => {
    try {
      let authToken = req.header("Authorization");
      authToken = authToken.substr(7, authToken.length);
      const decodedToken = jwt.verify(authToken, process.env.JWT_ACC_ACTIVATE1);

      const { email, username } = decodedToken;
      const newLog = req.body.text.trim();
      console.log(newLog);
      if (newLog == undefined || newLog.length === 0) {
        throw "Empty Log";
      }

      const creator = await User.findOne({ email: email });
      // const numberOfThoughts = creator.createdThoughts.length;
      // if (numberOfThoughts === 0) {
      //   throw "Didn't set thought of the day";
      // }
      // const lastThoughtDate = new Date(creator.createdThoughts[numberOfThoughts - 1].getTimestamp());
      // const today = new Date();
      // if (today.setUTCHours(00, 00, 00, 000) != lastThoughtDate.setUTCHours(00, 00, 00, 000)) {
      //   throw "Didn't set thought of the day";
      // }

      const log = new Log({ logMessage: newLog, creator: creator._doc._id });
      await log.save();
      creator.createdLogs.push(log);
      await creator.save();
      const logNumber = creator.createdLogs.length;

      return res.json({
        success: true,
        message: "Log created",
        logNumber: logNumber,
      });
    } catch (error) {
      console.error(error);
      return res.json({ success: false, error: error });
    }
  },
  logView: async (req, res) => {
    try {
      // let authToken = req.header("Authorization");
      // authToken = authToken.substr(7, authToken.length);

      // const decodedToken = jwt.verify(authToken, process.env.JWT_ACC_ACTIVATE1);

      const { username, date } = req.body;
      if (username === undefined) {
        throw "No username given";
      }

      let dateObj = new Date(date);

      let year = dateObj.getUTCFullYear();
      let month = dateObj.getUTCMonth() + 1;
      let day = dateObj.getUTCDate();
      const newDate = `${year}-${month}-${day}`;
      console.log(newDate);
      console.log(new Date(newDate).setUTCHours(00, 00, 00, 000));
      console.log(new Date(newDate).setUTCHours(23, 59, 59, 999));
      const result = await User.findOne({ username: username })
        .populate({
          path: "createdThoughts",
          match: {
            createdAt: {
              $gte: new Date(newDate).setUTCHours(00, 00, 00, 000),
              $lte: new Date(newDate).setUTCHours(23, 59, 59, 999),
            },
          },
        })
        .populate({
          path: "createdLogs",
          match: {
            createdAt: {
              $gte: new Date(newDate).setUTCHours(00, 00, 00, 000),
              $lte: new Date(newDate).setUTCHours(23, 59, 59, 999),
            },
          },
        });
      const userData = {
        thought: [...result["createdThoughts"]],
        logs: [...result["createdLogs"]],
      };
      console.log(result["createdThoughts"][0]);

      return res.json({ success: true, message: userData });
    } catch (error) {
      console.error(error);
      return res.json({ success: true, message: error });
    }
  },
};
