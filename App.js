const express = require("express");
const app = express();
const apiRoutes = require("./routes/Route.js");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const Log = require("./models/log");
const rateLimit = require("express-rate-limit");

//middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 1000,
  max: 2,
  message: "Too many request in created, please wait for some time",
});

app.use(limiter);
app.use(cors());

app.use("/api", apiRoutes);
app.get("/logStream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();
  Log.watch().on("change", async (change) => {
    const logChange = { ...change["fullDocument"] };
    const newLog = new Log(logChange);
    await newLog.populate("creator", "username");
    res.write(`data: ${JSON.stringify(newLog)}\n\n`);
  });
});

module.exports = app;

// if(allLogs){
//   console.log('true');
// }
// else{
//   console.log('false');
// }
