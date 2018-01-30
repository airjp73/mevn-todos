var express = require("express")
var passport = require('passport')
var api = express.Router()

//passport strategies
var configPassport = require('./configPassport')
configPassport()

api.route('/login').get(
  passport.authenticate('facebook')
)

api.route('/callback').get(
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  })
)

module.exports = api;
