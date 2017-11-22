"use strict"

var express       = require("express")
var mongoose      = require('mongoose')
var passport      = require("passport")        //authentication
var session       = require('express-session') //session storing
var bodyParser    = require('body-parser')
var cookieParser  = require('cookie-parser')   //cookies
var logger        = require('morgan')
var configurePassport = require("./config/configurePassport")

//Environment Variables
require('env2')('secrets.env')

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
  secret : process.env.PASSPORT_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}))
app.use(passport.initialize())
app.use(passport.session())
configurePassport(passport)
app.use(logger('dev'))

//api routes
var apiRoutes = require("./routes/routes.js")
app.use("/api", apiRoutes)
//all other routes serve frontend use frontend router
app.get("*", function(req, res) {res.sendFile(__dirname + "/app/index.html")})

/*
    Connect to DB
*/
mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_URL).then(
  () => {console.log("Database is connected")},
  err => {console.log("Can not connect to the database" + err)}
)

/*
  Start listening
*/
var port = process.env.PORT || 3000
var server = app.listen(port, function() {
  console.log("Listening on port " + port)
})
