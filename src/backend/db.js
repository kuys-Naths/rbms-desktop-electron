const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

app.use(cors());
app.use(express.json());


// Connect to MongoDB Atlas
// mongoose.connect('mongodb+srv://rbms2024:Rbmsdb7kagZ989!..@rbms.lnwpz.mongodb.net/RBMS');
mongoose.connect(process.env.mdbURI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB Atlas');
});

module.exports = db;