var express = require("express")
var passport = require('passport')
var api = express.Router()
var User = require("../../models/user.js")

//custom middleware
var requireLoggedIn = require("../middleware/requireLoggedIn.js")
var requireFields = require("require-fields")

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
