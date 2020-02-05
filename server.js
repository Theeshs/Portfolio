const express = require('express');

// const firbaseClient = require('./db').db_clienet
const auth = require('./routes/api/auth')
const profile = require('./routes/api/profile')
const bodyParser = require('body-parser')
const passport = require('passport')

const app = express();

// Passport middleware
app.route(passport.initialize())

// passport Config
require('./ServiceData/passport')(passport)

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/api/users', auth)
app.use('/api/profile', profile)

const port = process.env.PORT || 5020;

app.listen(port, ()=> console.log(`Serever running on port ${port}`))

// exports.app = fuctions.https.onRequest(app)