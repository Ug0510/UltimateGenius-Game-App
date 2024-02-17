const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI; 

mongoose.connect(uri);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting database'));

db.once('open', function(){
    console.log("Connected to Database:: MONGODB");
});

module.exports = db;
