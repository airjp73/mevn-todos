"use strict"

var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy
var User = require('../../../models/user')

if (process.env.NODE_ENV == 'unitTests') {
  process.env.FACEBOOK_ID = "testID"
  process.env.FACEBOOK_SECRET = "testSecret"
}

module.exports = () => {
  passport.use('facebook', new FacebookStrategy ({
      clientID      : process.env.FACEBOOK_ID,
      clientSecret  : process.env.FACEBOOK_SECRET,
      callbackURL   : "http://" + process.env.HOST + "/api/facebook/callback"
    },
    async (token, refreshToken, profile, done) => {
      try {
        var user = await User.findOne({facebookId: profile.id})

        if (!user) {
          user = new User()
          user.facebookId = profile.id
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
