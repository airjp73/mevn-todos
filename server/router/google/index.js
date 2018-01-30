var express = require("express")
var passport = require('passport')
var api = express.Router()

//passport strategies
var configPassport = require('./configPassport')
configPassport()

api.route('/login').get(
  passport.authenticate('google', {
    scope: [
       'https://www.googleapis.com/auth/userinfo.email'
     ]
  })
)

api.route('/callback').get(
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/'
  })
)

module.exports = api;
