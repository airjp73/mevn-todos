"use strict"

//A wrapper for passport.authenticate that includes custom error handling

var passport = require('passport')

module.exports = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      //errors go to handleErrors
      if (err)
        return next(err)

      //any other problems get a 401 + relavent info
      if (!user)
        return res.status(401).json(info)

      //login if no problems
      req.login(user, (err) => {
        if (err)
          return next(err)
        return next()
      })

    })(req, res, next)
  }
}
