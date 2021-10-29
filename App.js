const express = require('express');
const app = express();
const apiRoutes = require('./routes/Route.js');
const morgan = require('morgan');
const mongoose = require('mongoose');


//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Authorization, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
    if ("OPTIONS" === req.method) {
      res.sendStatus(200);
    } else {
      console.log(`${req.ip} ${req.method} ${req.url}`);
      next();
    }
  });

// route
app.use('/api', apiRoutes);

module.exports = app;