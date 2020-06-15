const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const db = require('./config/database')
const passport = require('passport')
const cookieSession = require('cookie-session')

app.use(cookieSession({ 
    keys: ['cookieKey'],
    maxAge: 60*1000,
}))

db.authenticate()
	.then(() => console.log('Database connected'))
	.catch(err => console.log('Database not connected: ' + err))

app.use(cookieSession({
	maxAge: 60*1000,
	keys: ['keys']
}))

// parse application/json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// express-session middleware
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true,
}))

// Passport Config
require('./config/passport.js')(passport)
app.use(passport.initialize())
app.use(passport.session())

// Route Files
let routes = require('./routes/index.js')
app.use('/', routes)

app.listen(3001, () => console.log(`Example app listening at http://localhost:3001`))