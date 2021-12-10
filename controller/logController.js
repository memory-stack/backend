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
  todaysLogs: async (req, res) => {
    try {
      let authToken = req.header("Authorization");
      authToken = authToken.substr(7, authToken.length);

      const decodedToken = jwt.verify(authToken, process.env.JWT_ACC_ACTIVATE1);
      const { email, username } = decodedToken;

      const result = await User.findOne({ email: email }, { createdLogs: 1 }).populate({
        path: "createdLogs",
        match: {
          createdAt: {
            $gte: new Date().setUTCHours(00, 00, 00, 000),
            $lte: new Date().setUTCHours(23, 59, 59, 999),
          },
        },
        options:{sort:{createdAt:1}}
      });
      const logs= result['createdLogs'].map(log=>{
        return{
          logMessage:log.logMessage,
          createdAt:log.createdAt
        }
      });
      return res.json({ success: true ,logs:logs});
    } catch (error) {
      console.error(error);
      return res.json({ success: false, error: error });
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
      const { username, date } = req.body;
      if (username === undefined) {
        throw "No username given";
      }

      var dateObj = date.split("/");   
      let day = dateObj[0];
      let month = dateObj[1]-1;
      let year = dateObj[2];
      
      const newDate = new Date(Date.UTC(year, month, day));
      const result = await User.findOne({ username: username }, {})
        .populate({
          path: "createdLogs",
          match: {
            localCreationDate: {
              $gte: new Date(newDate).setUTCHours(00, 00, 00, 000),
              $lte: new Date(newDate).setUTCHours(23, 59, 59, 999),
            },
          },
        });
      const userData = {
        logs: [...result["createdLogs"]],
      };
      return res.json({ success: true, message: userData });
    } catch (error) {
      console.error(error);
      return res.json({ success: true, message: error });
    }
  },
};
