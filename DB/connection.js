const mongoose = require('mongoose');
require('dotenv').config();

const URI = process.env.URI

//db connection
mongoose.connect(URI)
.then(res => {
    console.log(`MongodB connected ${res.connections[0].name}`);
})
.catch(err => {
    console.log(err);
});