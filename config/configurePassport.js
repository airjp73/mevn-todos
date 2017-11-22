var LocalStrategy = require("passport-local").Strategy
var User = require("../models/user.js")
var crypto = require("crypto")

module.exports = function(passport) {
  //session setup
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    console.log("DDDD")
    User.findById(id, function(err, user) {
      done(err, user)
    })
  })

  //local signup
  passport.use("local-signup", new LocalStrategy({
    //email and password are names of the form fields
    usernameField : "email",
    passwordField : "password",
    passReqToCallback : true
  },
  function(req, email, password, done) {
    User.findOne({"email" : email})
      .then((user) => {
        if (user)
          return done(null, false, {message: "email in use"})

        var newUser = new User()
        newUser.email = email
        newUser.profileName = req.body.profileName
        newUser.password = newUser.generateHash(password)
        newUser.confirmEmailToken = crypto.randomBytes(16).toString('hex')
        newUser.save()
          .then((user) => {
            user.password = undefined
            return done(null, user)
          })
      })
      .catch((err) => {
        console.log(err)
        throw err
      })
  }))

  //local login
  passport.use("local-login", new LocalStrategy({
    usernameField : "email",
    passwordField : "password",
    passReqToCallback : true
  },
  function(req, email, password, done) {
    User.findOne({"email" : email}, "+password", function(err, user) {
      if (err)
        console.log(err)
      if (!user)
        return done(null, false, {message : "no user found"})
      if (!user.validPassword(password))
        return done(null, false, {message : "invalid password"})

      user.password = undefined

      return done(null, user)
    })
  }))
}
