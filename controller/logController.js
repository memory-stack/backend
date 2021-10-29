const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

module.exports = {
    displayLogs : (req, res) => {
        var authToken = req.header("Authorization");
        authToken = authToken.substr(7, authToken.length);
        console.log(authToken);
        jwt.verify(authToken, process.env.JWT_ACC_ACTIVATE1, (error, decodedToken) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    error: 'Incorrect or expired link.'
                });
            }
            else {
                //var username = req.body.username;
                const { username } = decodedToken;
                console.log(username);
    
                User.find({ username: username })
                .exec()
                .then(result => {
                    console.log(result[0].logs);
                    res.status(200).json(result[0].logs);
                })
                .catch(error => {
                    console.log(error);
                    res.status(500).json({
                        message: "Something bad happened.",
                        error: error
                    });
                });
            }
        })
    },

    createLog : (req, res) => {
        var authToken = req.header("Authorization");
        authToken = authToken.substr(7, authToken.length);
        console.log(authToken);
        jwt.verify(authToken, process.env.JWT_ACC_ACTIVATE1, (error, decodedToken) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    error: 'Incorrect or Expired Link.'
                });
            }
            else {
                console.log("print log");
                const { email, username } = decodedToken;
                console.log(email);
                console.log(username);
    
    
                //var username = req.body.username;
                var newlog = req.body.text;
                var timeNow = new Date();
    
                console.log(newlog);
    
                if (newlog != undefined && newlog.length) {
                    User.update({ username: username }, { $push: { "logs": [{ "timestamp": timeNow, "logs": newlog }] } })
                        .exec()
                        .then(result => {
                            if (result.matchedCount) {
                                console.log(result);
                                res.status(200).json({
                                    message: "log updated for" + username
                                });
                            }
                            else {
                                console.log("No user as " + username + " found");
                                res.status(200).json({
                                    message: "No user as " + username + " found"
                                });
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            res.status(500).json({
                                message: "something bad happened.",
                                error: error
                            });
                        });
                }
                else {
                    console.log("No log found. Please enter a log.");
                    res.status(200).json({
                        message: "No log found. Please enter a log."
                    });
                }
            }
        });
    }
};