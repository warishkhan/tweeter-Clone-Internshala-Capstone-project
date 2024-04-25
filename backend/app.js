const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'});
const bodyParser = require("body-parser");
const cors = require('cors')
const errorMiddleware = require('./middleware/error')

app.use(cors())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads/image', express.static('uploads/image'));
app.use('/uploads/profilePictures', express.static('uploads/profilePictures'));


// route imports
const user = require('./routes/userRoute');
const tweet = require('./routes/tweetRoute');

app.use('/api/v1',user)
app.use('/api/v1',tweet)


// middleware for errors
app.use(errorMiddleware)

module.exports = app;