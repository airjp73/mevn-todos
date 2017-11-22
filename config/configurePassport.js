var LocalStrategy = require("passport-local").Strategy
var User = require("../models/user.js")

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
    User.findOne({"email" : email}, function(err, user) {
      if (err)
        return done(err)
      if (user) {
        //if email is taken
        return done(null, false, {message: "email in use"})
      }
      else {
        var newUser = new User()

        newUser.email = email
        newUser.profileName = req.body.profileName
        newUser.password = newUser.generateHash(password)

        newUser.save(function(err, user) {
          if (err)
            throw err
          user.password = undefined
          return done(null, newUser)
        })
      }
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
