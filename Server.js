const http = require('http');
require('dotenv').config();
const port = process.env.PORT || 3000;
const app = require('./App.js');
const server = http.createServer(app);
require('./DB/connection');  // DB connection

server.listen(port, ()=>console.log(`API running at port ${port}`)); 
