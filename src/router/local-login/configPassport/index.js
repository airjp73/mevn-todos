"use strict"

var passport = require('passport')

module.exports = () => {
  var localSignupStrategy = require('./local-signup-strategy')
  var localLoginStrategy  = require('./local-login-strategy')

  passport.use('local-signup',  localSignupStrategy)
  passport.use('local-login',   localLoginStrategy)
}
