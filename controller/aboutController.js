const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

module.exports = {
    
    setAbout : (req, res) => {
        var username = req.body.username;
        var newabout = req.body.newAbout;
        User.update({ username: username }, { $set: { "about": newabout } })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(error => {
            console.log(err);
            res.status(500).json({
                message: "something bad happened.",
                error: error
            });
        });
    },

    about : (req, res) => {
        var username = req.body.username;
        User.find({ username: username })
        .exec()
        .then(result => {
            console.log(result[0].about);
            res.status(200).json(result[0].about);
        })
        .catch(error => {
            console.log(err);
            res.status(500).json({
                message: "something bad happened.",
                error: error
            });
        });
    }
   

};