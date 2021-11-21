const User = require("../models/user.js");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// function for sending email using NodeMail
const sendEmail = (email, authToken) => {
  const gmail_email = process.env.GMAIL_EMAIL;
  const gmail_password = process.env.GMAIL_PASSWORD;
  var transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: gmail_email,
      pass: gmail_password,
    },
  });

  var mailOptions = {
    from: "memory-stack",
    to: email,
    subject: "Email Confirmation for Account Activation",
    html: `<h1>Thank You For Choosing Us</h1>
            <p1>Press <a href=https://api-memory-stack.herokuapp.com/api/verify/${authToken} > here </a> to verify your email.</p1> <br><br>
            <p1>The Link will expire in <strong>20 minutes!</strong></p1>`,
  };

  console.log(mailOptions);

  transport.sendMail(mailOptions, (err, res) => {
    if (err) {
      console.log("Error occured!");
      console.log(err);
      res.status(500).json({
        message: err,
      });
    } else {
      console.log("Email sent!");
      res.status(200).json({
        message: "email sent",
      });
    }
  });
};

module.exports = {
  userExists: (req, res) => {
    var username = req.body.username;

    User.find({ username: username })
      .exec()
      .then((result) => {
        if (result.length) {
          console.log("User already exists.");
          res.status(200).json({
            message: "True",
          });
        } else {
          console.log("User doesn't exists.");
          res.status(200).json({
            message: "False",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: error,
        });
      });
  },

  verifyToken: (req, res) => {
    const { authToken } = req.params;
    console.log("hello");
    if (authToken) {
      jwt.verify(
        authToken,
        process.env.JWT_ACC_ACTIVATE,
        (err, decodedToken) => {
          if (err) {
            return res
              .status(400)
              .json({ error: "Incorrect or Expired Link." });
          }
          const { email, username } = decodedToken;
          console.log(email);
          console.log(username);
          const user = User.find({ email: email });
          if (user) {
            // console.log(user);

            User.update({ username: username }, { $set: { isVerified: true } })
              .exec()
              .then((result) => {
                console.log(result);
                res.redirect(
                  "https://memory-stack.herokuapp.com/verification-success"
                );
              })
              .catch((error) => {
                console.log(error);
                res.status(500).json({
                  message: error,
                });
              });
            // res.send("<h1>Account Verified!</h1><p1>Please <a href=http://192.168.0.103:3000/api/verification-success > Login </a></p1>");
          } else {
            // res.json('user not found');
            res.status(200).json({
              message: "user not found",
            });
          }
        }
      );
    } else {
      // return res.json({error : "Something went wrong!"});
      res.status(250).json({
        message: "Something went wrong!",
      });
    }
  },

  signup: async (req, res) => {
    try {
      let username = req.body.username.trim();
      let password = req.body.password.trim();
      let email = req.body.email.trim();
      let about = req.body.about.trim();

      if (username === undefined || username.length === 0)
        throw "No username given";
      if (password === undefined || password.length === 0)
        throw "No password given";
      if (email === undefined || email.length === 0) 
        throw "No email given";
      if (about === undefined || about.length === 0) 
        throw "No about given";

      email = email.toLowerCase();
      console.log(email);
      if (!validateEmail(email)) throw "Email is invalid";

      let user = await User.findOne({
        $or: [{ email: email }, { username: username }],
      });

      if (user && user.email == email) {
        throw "User with this email already exist";
      }
      if (user && user.username == username) {
        throw "User with this username already exist";
      }

      user = new User({
        username: username,
        password: password,
        about: about,
        email: email,
      });

      await user.save();
      const _id = user._id;

      const authToken = jwt.sign(
        { email, username, _id },
        process.env.JWT_ACC_ACTIVATE
      );

      const result = sendEmail(email, authToken);
      return res.json({ success: true, message: "User created" });
    } catch (error) {
      console.error(error);
      return res.json({ success: false, error: error });
    }
  },

  login: async (req, res) => {
    try {
      let username = req.body.username.trim();
      let password = req.body.password.trim();

      if (username === undefined || username.length === 0)
        throw "No username given";
      if (password === undefined || password.length === 0)
        throw "No password given";

      const user = await User.findOne({ username: username });

      if (!user) throw "Incorrect username";

      const isMatch = await bcrypt.compare(password, user.password);

      const email = user.email;
      const _id = user._id;
      const uniqueString = jwt.sign(
        { email, username, _id },
        process.env.JWT_ACC_ACTIVATE1,
        {}
      );

      if (!isMatch) throw "Incorrect password";

      if (!user.isVerified) throw "Please verify your account to login";

      return res.json({ success: true, message: uniqueString });
    } catch (error) {
      console.error(error);
      return res.json({ success: false, error: error });
    }
  },

  getUserDetails: async (req, res) => {
    try {
      const username = req.params.username;
      const result = await User.findOne({ username: username }).populate(
        "createdThoughts"
      );
      if (!result) {
        return res.status(404).json({ message: "No such user found" });
      }
      const userInfo = {
        about: result["about"],
        thoughts: [...result["createdThoughts"]],
      };
      console.log(userInfo);
      return res.status(200).json({ user: userInfo });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },
};
