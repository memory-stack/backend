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
    html: `<!DOCTYPE html>
            <html>
            <head>
                <title></title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <style type="text/css">
                    @media screen {
                        @font-face {
                            font-family: 'Lato';
                            font-style: normal;
                            font-weight: 400;
                            src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: normal;
                            font-weight: 700;
                            src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: italic;
                            font-weight: 400;
                            src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: italic;
                            font-weight: 700;
                            src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                        }
                    }
            
                    /* CLIENT-SPECIFIC STYLES */
                    body,
                    table,
                    td,
                    a {
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                    }
            
                    table,
                    td {
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                    }
            
                    img {
                        -ms-interpolation-mode: bicubic;
                    }
            
                    /* RESET STYLES */
                    img {
                        border: 0;
                        height: auto;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
                    }
            
                    table {
                        border-collapse: collapse !important;
                    }
            
                    body {
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                    }
            
                    /* iOS BLUE LINKS */
                    a[x-apple-data-detectors] {
                        color: inherit !important;
                        text-decoration: none !important;
                        font-size: inherit !important;
                        font-family: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                    }
            
                    /* MOBILE STYLES */
                    @media screen and (max-width:600px) {
                        h1 {
                            font-size: 32px !important;
                            line-height: 32px !important;
                        }
                    }
            
                    /* ANDROID CENTER FIX */
                    div[style*="margin: 16px 0;"] {
                        margin: 0 !important;
                    }
                </style>
            </head>
            
            <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                <!-- HIDDEN PREHEADER TEXT -->
                <div style="display: none; font-size: 1px; color: #EE5C54; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <!-- LOGO -->
                    <tr>
                        <td bgcolor="#A772FF" align="center">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#A772FF" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#222222" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #EEEEEE; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                        <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <!-- box-shadow: 0px 0px 20px 4px rgba(0, 0, 0, 0.25); -->
                        
                        <td bgcolor="#1A1A1A" align="center" style="padding: 0px 10px 80px 10px;">
                                <table  border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                    <tr>
                                        <td bgcolor="#222222" align="left" style="padding: 20px 30px 40px 30px; color: #999999; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                            <p style="margin: 0;">We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td bgcolor="#222222" align="left">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td bgcolor="#222222" align="center" style=" padding: 20px 30px 60px 30px;">
                                                        <table border="0" cellspacing="0" cellpadding="0">
                                                            <tr>
                                                                <td align="center" style="border-radius: 3px;" bgcolor="#A772FF"><a href=https://api-memory-stack.herokuapp.com/api/verify/${authToken} target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 0px solid #FFA73B; display: inline-block;">Confirm Account</a></td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr> <!-- COPY -->
                                    
                                    <tr>
                                        <td bgcolor="#222222" align="left" style="padding: 0px 30px 20px 30px; color: #999999; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                            <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td bgcolor="#222222" align="left" style=" padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #999999; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                            <p style="margin: 0;">Cheers,<br>MEMORY STACK Team</p>
                                        </td>
                                    </tr>
                                </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>`,
  };

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
      let password = req.body.password;

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
