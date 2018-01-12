"use strict"

var User = require('../../../models/user')
var LocalStrategy = require('passport-local').Strategy

module.exports = new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  async (req, email, password, done) => {
    try {

      //check for existing user
      var user = await User.findOne({email: email})
      if (user)
        return done(null, false, {message: "Email in use"})

      //create new user
      user = new User()
      user.email = email
      user.genConfirmEmailToken()
      user.setPassword(password)
      user = await user.save()

      return done(null, user)

    }
    catch(err) {
      done(err)
    }
  }
)
