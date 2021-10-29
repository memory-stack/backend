const express = require('express');
const router = express.Router('router');
const User = require('../models/user.js');
const mongoose = require('mongoose');
const { restart } = require('nodemon');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

require('dotenv').config();



const uri = process.env.URI

//db connection
mongoose.connect(uri)
    .then(res => {
        console.log(`MongodB connected ${res.connections[0].name}`);
    })
    .catch(err => {
        console.log(err);
    });


router.get('/', (req, res)=>{
    res.status(200).json({
        message: 'Server is up!'
    });
});

//username taken or not
router.post('/userExists', (req, res) => {
    var username = req.body.username;

    User.find({ username: username })
        .exec()
        .then(result => {
            if (result.length) {
                console.log("User already exists.");
                res.status(200).json({
                    message: "True"
                });
            }
            else {
                console.log("User doesn't exists.");
                res.status(200).json({
                    message: "False"
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: error
            })
        })
});

//
const sendEmail = (email, authToken) => {

    const gmail_email = process.env.GMAIL_EMAIL;
    const gmail_password = process.env.GMAIL_PASSWORD;
    var transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: gmail_email,
            pass: gmail_password,
        }
    });
 

    var mailOptions = {
        from: "memory-stack",
        to: email,
        subject: "Email Confirmation for Account Activation",
        html: `<h1>Thank You For Choosing Us</h1>
            <p1>Press <a href=https://api-memory-stack.herokuapp.com/api/verify/${authToken} > here </a> to verify your email.</p1> <br><br>
            <p1>The Link will expire in <strong>20 minutes!</strong></p1>`
    };

    console.log(mailOptions);

    transport.sendMail(mailOptions, (err, res) => {
        if (err) {
            console.log("Error occured!");
            console.log(err);
            res.status(500).json({
                message: err
            })
        }
        else {
            console.log("Email sent!");
            res.status(200).json({
                message: "email sent"
            })
        }
    });
}

router.get('/verify/:authToken', (req, res) => {
    const { authToken } = req.params;
    console.log("hello");
    if (authToken) {
        jwt.verify(authToken, process.env.JWT_ACC_ACTIVATE, (err, decodedToken) => {
            if (err) {
                return res.status(400).json({ error: 'Incorrect or Expired Link.' });
            }
            const { email, username } = decodedToken;
            console.log(email);
            console.log(username);
            const user = User.find({ email: email });
            if (user) {
                // console.log(user);

                User.update({ username: username }, { $set: { isVerified: true } })
                    .exec()
                    .then(result => {
                        console.log(result);
                        res.redirect('https://memorystack.herokuapp.com/verification-success');
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(500).json({
                            message: error
                        })
                    })
                // res.send("<h1>Account Verified!</h1><p1>Please <a href=http://192.168.0.103:3000/api/verification-success > Login </a></p1>");

            }
            else {
                // res.json('user not found');
                res.status(200).json({
                    message: "user not found"
                })
            }
        });

    }
    else {
        // return res.json({error : "Something went wrong!"}); 
        res.status(250).json({
            message: "Something went wrong!"
        })
    }

});

router.post('/signup', async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    const user = new User({
        username: username,
        password: password,
        email: email
    });

    console.log(username);
    console.log(password);
    console.log(email);

    //then?
    user.save().then(result1 => {
        const authToken = jwt.sign({ email, username }, process.env.JWT_ACC_ACTIVATE)
        const result = sendEmail(email, authToken);
        res.status(200).json({
            message: "user created."
        });
    })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: error
            });
        })
});

//done
router.post('/login', (req, res) => {

    var username = req.body.username;
    var password = req.body.password;

    User.find({ username: username })
        .exec()
        .then(result => {
            if (result.length) {
                var email = result[0].email;

                console.log(result);
                console.log(password);
                console.log(result[0].password);
                console.log(email);

                //password match and jwt generation
                bcrypt.compare(password, result[0].password)
                    .then(comparedResult => {
                        const uniqueString = jwt.sign({ email, username }, process.env.JWT_ACC_ACTIVATE1, { expiresIn: '2h' });
                        console.log(uniqueString);
                        console.log(comparedResult);

                        if (comparedResult) {
                            if (!result[0].isVerified) {
                                res.status(200).json({
                                    message: "Please vefify your account to login",
                                    result: "false"
                                })
                            }
                            else {
                                res.status(200).json({
                                    message: uniqueString,
                                    result: "true"
                                })
                            }
                        }
                        else {
                            res.status(200).json({
                                message: "Incorrect username or password",
                                result: "false"
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(500).json({
                            message: error,
                        })
                    })


            }
            else {
                console.log(username);
                res.status(200).json({
                    message: "Incorrect username or password",
                    result: "false"
                })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: error
            });
        });
});

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