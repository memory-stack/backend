const express = require('express');
const router = express.Router('router');
const userController = require('../controller/userController');
const logController = require('../controller/logController');
// const thoughtController = require('../controller/thoughtController');
const aboutController = require('../controller/aboutController');
require('dotenv').config();


router.get('/', (req, res)=>{
    res.status(200).json({
        message: 'Server is up!'
    });
});


router.post('/userExists'       , userController.userExists);  //username exists or not
router.get ('/verify/:authToken', userController.verifyToken);  // verify the auth token
router.post('/signup'           , userController.signup);
router.post('/login'            , userController.login);
router.get ('/user/:username'   , userController.getUserDetails);
router.post('/setUserColor'     , userController.setUserColor);
router.post('/setAbout'         , aboutController.setAbout);
router.get ('/about'            , aboutController.about); 
router.get ('/displayLogs/:username' , logController.displayLogs);
router.post('/createLog'             , logController.createLog)
router.post('/logView'               , logController.logView); 
router.get ('/todaysLogs'            , logController.todaysLogs);     
router.get ('/recentLogs'            , logController.recentLogs);

module.exports = router;