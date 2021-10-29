const express = require('express');
const router = express.Router('router');
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userController = require('../controller/userController');
const logController = require('../controller/logController');
require('dotenv').config();


router.get('/', (req, res)=>{
    res.status(200).json({
        message: 'Server is up!'
    });
});


router.post('/userExists'       , userController.userExists);  //username exists or not
router.get ('/verify/:authToken',userController.verifyToken);  // verify the auth token
router.post('/signup'           , userController.signup);
router.post('/login'            , userController.login);
router.post('/displayLogs'      , logController.displayLogs);
router.post('/createLog'        , logController.createLog); //done - handled if no user is matched, if no new loglength is 0

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