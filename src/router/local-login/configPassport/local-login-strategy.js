"use strict"

var LocalStrategy = require('passport-local').Strategy
var User = require('../../../models/user')

module.exports = new LocalStrategy ({
    usernameField : 'email',
    passwordField : 'password'
  },
  async (email, password, done) => {
    try {
      var user = await User.findOne({email: email}, "password")

      if (!user)
        return done(null, false, {message : "no user found"})
      if ( !(await user.validPassword(password)) )
        return done(null, false, {message : "invalid password"})

      return done(null, user)
    }
    catch(err) {
      done(err)
    }
  }
)
