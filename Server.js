const http = require("http");
// const socket = require("socket.io");
const Log = require("./models/log");
require("dotenv").config();
const port = process.env.PORT || 3000;
const app = require("./App.js");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});
// socket.set('origins','*:*');
// const io = new socket.Server(server);

io.on("connection", async (socket) => {
  console.log("A user connected: ", socket.id);
  const allLogs = await Log.find();
  socket.emit("recentLogs", allLogs);

  Log.watch().on("change", async (chnage) => {
    const allLogs = await Log.find();
    socket.emit("recentLogs", allLogs);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
require("./DB/connection"); // DB connection

server.listen(port, () => console.log(`API running at port ${port}`));
