const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

module.exports = {
    
    setThought : (req, res) => {

        var username = req.body.username;
        var thought = req.body.thought;
        var timeNow = new Date();
    
        console.log(thought);
    
        User.update({ username: username }, { $set: { "thought": [{ "timestamp": timeNow, "thought": thought }] } })
        .exec()
        .then(result => {
            if (result.matchedCount) {
                console.log(result);
                res.status(200).json(result);
            }
            else {
                console.log("No user as " + username + " found");
                res.status(200).json({
                    message: "No user as " + username + " found"
                });
            }
        })
        .catch(error => {
            console.log(err);
            res.status(500).json({
                message: "something bad happened.",
                error: error
            });
        });
    },

    allthought : (req, res) => {
        var username = req.body.username;
    
        User.find({ username: username })
            .exec()
            .then(result => {
                if (result.length) {
                    console.log(result[0].thought);
                    res.status(200).json(result[0].thought);
                }
                else {
                    console.log("No user as " + username + " found");
                    res.status(200).json({
                        message: "No user as " + username + " found"
                    });
                }
            })
            .catch(error => {
                console.log(err);
                res.status(500).json({
                    message: "something bad happened.",
                    error: error
                });
            })
    }

};