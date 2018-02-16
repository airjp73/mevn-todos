"use strict"

var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth2').Strategy
var User = require('../../../models/user')

if (process.env.NODE_ENV == 'unitTests') {
  process.env.GOOGLE_ID = "testID2"
  process.env.GOOGLE_SECRET = "testSecret2"
}

module.exports = () => {
  passport.use('google', new GoogleStrategy ({
      clientID      : process.env.GOOGLE_ID,
      clientSecret  : process.env.GOOGLE_SECRET,
      callbackURL   : "http://" + process.env.HOST + "/api/google/callback"
    },
    async (token, refreshToken, profile, done) => {
      try {
        var user = await User.findOne({googleId: profile.id})

        if (!user) {
          user = new User()
          user.googleId = profile.id
          user = await user.save()
        }

        return done(null, user)
      }
      catch(err) {
        done(err)
      }
    }
  ))
}
