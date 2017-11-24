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
    (req, email, password, done) => {
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
    }
  ))

  //Local Login
  passport.use("local-login", new LocalStrategy ({
      usernameField : "email",
      passwordField : "password",
      passReqToCallback : true
    },
    (req, email, password, done) => {
      User.findOne({"email" : email}, "+password")
        .then((user) => {
          if (!user)
            return done(null, false, {message : "no user found"})
          if (!user.validPassword(password))
            return done(null, false, {message : "invalid password"})

          user.password = undefined
          return done(null, user)
        })
        .catch((err) => {
          console.log(err)
          return done(null, false, {message: "server error"})
        })
    }
  ))
}
