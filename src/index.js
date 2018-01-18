"use strict"

var express       = require("express")
var mongoose      = require('mongoose')
var passport      = require("passport")
var session       = require('express-session')
var bodyParser    = require('body-parser')
var cookieParser  = require('cookie-parser')
var logger        = require('morgan')

//Environment Variables
require('env2')('secrets.env')

/*
    Connect to DB
*/
//if(process.env.NODE_ENV = 'test')
  //change to testing database
mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_URL).then(
  ()  => {console.log("Database is connected")},
  err => {console.log("Can not connect to the database" + err)}
)

/*
  Nuxt
*/
var {Nuxt, Builder} = require('nuxt')
var nuxtConfig = require('../nuxt.config.js')
nuxtConfig.dev = !(process.env.NODE_ENV === 'production')

var nuxt = new Nuxt(nuxtConfig)

if (nuxtConfig.dev) {
  var builder = new Builder(nuxt)
  builder.build()
}

/*
  Express configuration
*/
const app = express()

//static files
app.use(express.static("app/public"))

//middleware
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(session({
  secret : process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(logger('dev'))

//api router
var apiRouter = require("./router")
app.use("/api", apiRouter)

//all other routes serve frontend and use frontend router
//app.get("*", function(req, res) {res.sendFile(__dirname + "/app/index.html")})
app.use(nuxt.render)

////Error handling goes last
var handleErrors = require("./router/middleware/handleErrors.js")
app.use(handleErrors)

//App level passport config
var configPassport = require('./configPassport')
configPassport()

/*
  Start listening
*/
var port = process.env.PORT || 3000
module.exports = app.listen(port, function() {
  console.log("Listening on port " + port)
})
