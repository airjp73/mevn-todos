var LocalStrategy = require("passport-local").Strategy
var User = require("../models/user.js")
var crypto = require("crypto")

module.exports = function(passport) {
  //Serialize and Deserialize
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then( (user) => { done(null, user) } )
      .catch( (err) => { done(err)        } )
  })

  //Local Signup
  passport.use("local-signup",  new LocalStrategy({
      //email and password are names of the form fields
      usernameField : "email",
      passwordField : "password",
      passReqToCallback : true
    },
    async (req, email, password, done) => {
      try {

        //check for existing user
        var user = await User.findOne({"email" : email})
        if (user)
          return done(null, false, {message: "email in use"})

        user = new User()
        user.email = email
        user.profileName = req.body.profileName
        user.password = user.generateHash(password)
        user.confirmEmailToken = crypto.randomBytes(16).toString('hex')
        user = await user.save()

        user.password = undefined
        return done(null, user)

      }
      catch(err) {
        done(err)
      }
    }
  ))

  //Local Login
  passport.use("local-login", new LocalStrategy ({
      usernameField : "email",
      passwordField : "password",
      passReqToCallback : true
    },
    async (req, email, password, done) => {
      try {

        var user = await User.findOne({"email" : email}, "+password")
        if (!user)
          return done(null, false, {message : "no user found"})
        if (!user.validPassword(password))
          return done(null, false, {message : "invalid password"})

        user.password = undefined
        return done(null, user)

      }
      catch(err) {
        done(err)
      }
    }
  ))
}
