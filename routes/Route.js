const express = require('express');
const router = express.Router('router');
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = require('../controller/userController');
require('dotenv').config();


router.get('/', (req, res)=>{
    res.status(200).json({
        message: 'Server is up!'
    });
});


router.post('/userExists', userController.userExists);  //username exists or not
router.get('/verify/:authToken',userController.verifyToken);  // verify the auth token
router.post('/signup', userController.signup);
router.post('/login', userController.login);

//done 
router.post('/displayLogs', (req, res) => {
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

});

//done - handled if no user is matched, if no new loglength is 0
router.post('/createLog', (req, res) => {

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



});

//done 
router.post('/setThought', (req, res) => {

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
});

//dont upload on github
//done - handled if no user is matched
router.post('/thought', (req, res) => {
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
});

router.post('/setAbout', (req, res) => {
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
});

//dont upload on github
router.post('/about', (req, res) => {
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
});

module.exports = router;