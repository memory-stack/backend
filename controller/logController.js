const User = require("../models/user.js");
const Log = require("../models/log");
const LogCreationDate = require("../models/logCreationDates");
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

      const result = await User.findOne(
        { email: email },
        { createdLogs: 1 }
      ).populate({
        path: "createdLogs",
        match: {
          createdAt: {
            $gte: new Date().setUTCHours(00, 00, 00, 000),
            $lte: new Date().setUTCHours(23, 59, 59, 999),
          },
        },
        options: { sort: { createdAt: 1 } },
      });
      const logs = result["createdLogs"].map((log) => {
        return {
          logMessage: log.logMessage,
          createdAt: log.createdAt,
        };
      });
      return res.json({ success: true, logs: logs });
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
      const localDate = req.body.date;
      const localTime = req.body.time;
      if (newLog == undefined || newLog.length === 0) {
        throw "Empty Log";
      }
      const dateComponents = localDate.split("/").map(Number);
      const localCreationDate = new Date(
        Date.UTC(dateComponents[2], dateComponents[1] - 1, dateComponents[0])
      );
      const creator = await User.findOne({ email: email });

      const log = new Log({
        logMessage: newLog,
        creator: creator._doc._id,
        localCreationDate: localCreationDate,
        localCreationTime: localTime,
      });
      const createdDate = new LogCreationDate({
        creator: creator._doc._id,
        localCreationDate: localCreationDate,
      });
      const dateExist = await LogCreationDate.findOne({
        creator: creator._doc._id,
        localCreationDate: localCreationDate,
      });

      await log.save();
      if (!dateExist) {
        await createdDate.save();
        creator.loggedDates.push(createdDate);
      }
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
      let month = dateObj[1] - 1;
      let year = dateObj[2];

      const newDate = new Date(Date.UTC(year, month, day));
      const result = await User.findOne({ username: username }, {}).populate({
        path: "createdLogs",
        match: {
          localCreationDate: {
            $gte: new Date(newDate).setUTCHours(00, 00, 00, 000),
            $lte: new Date(newDate).setUTCHours(23, 59, 59, 999),
          },
        },
      });
      if (result["color"] == undefined) result["color"] = "purple";
      const userData = {
        logs: [...result["createdLogs"]],
        color: result["color"],
      };
      return res.json({ success: true, message: userData });
    } catch (error) {
      console.error(error);
      return res.json({ success: true, message: error });
    }
  },
  recentLogs: async (req, res) => {
    try {
      const allLogs = await Log.find().populate("creator", "username");
      return res.json({ success: true, message: allLogs });
    } catch (error) {
      console.error(error);
      return res.json({ success: false, message: error });
    }
  },
  getLogs: async (req, res) => {
    try {
      let { page = 1, limit = 15, lastElementId } = req.query;
      if (limit > 30) limit = 30;
      let date;
      if (lastElementId) {
        const timestamp = lastElementId.toString().substring(0, 8);
        date = new Date(parseInt(timestamp, 16) * 1000);
      } else {
        date = new Date();
      }
      const allLogs = await Log.find({ createdAt: { $lt: new Date(date) } })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .populate("creator", "username color");
      const lastElement = allLogs[allLogs.length - 1]["_id"].toString();
      const result = allLogs.map((log) => {
        if (log["creator"]["color"] == undefined)
          log["creator"]["color"] = "purple";
        return log;
      });
      return res.json({
        success: true,
        total: allLogs.length,
        lastElementId: lastElement,
        message: result,
      });
    } catch (error) {
      console.error(error);
      return res.json({ success: false, message: error });
    }
  },
};
