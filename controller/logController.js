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

  createLog: (req, res) => {
    var authToken = req.header("Authorization");
    authToken = authToken.substr(7, authToken.length);
    console.log(authToken);
    jwt.verify(
      authToken,
      process.env.JWT_ACC_ACTIVATE1,
      (error, decodedToken) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            error: "Incorrect or Expired Link.",
          });
        } else {
          console.log("print log");
          const { email, username } = decodedToken;
          console.log(email);
          console.log(username);

          //var username = req.body.username;
          var newlog = req.body.text;
          var timeNow = new Date();

          console.log(newlog);

          if (newlog != undefined && newlog.length) {
            User.findOne({ email: email })
              .then((creator) => {
                const log = new Log({
                  logMessage: newlog,
                  creator: creator._doc._id,
                });
                log.save().then(async (result) => {
                  creator.createdLogs.push(log);
                  await creator.save();
                  const logNumber = creator.createdLogs.length;
                  return res.status(200).json({
                    success: true,
                    message: "Log created",
                    logNumber: logNumber,
                  });
                });
              })
              .catch((err) => {
                return res.status(500).json({ message: err });
              });
          } else {
            console.log("No log found. Please enter a log.");
            res.status(200).json({
              message: "No log found. Please enter a log.",
            });
          }
        }
      }
    );
  },
};
