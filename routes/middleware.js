var passport = require("passport")
var User = require("../models/user.js")
var mailer = require("../config/mailer.js")
var crypto = require("crypto")

module.exports = {
  checkAuth(req, res, next) {
    if (!req.isAuthenticated())
      return res.sendStatus(401)
    next();
  },

  requireFields(fields) {
    return (req, res, next) => {
      var missingFields = []

      for (var i = 0; i < fields.length; ++i) {
        if (!req.body[fields[i]]) {
          missingFields.push(fields[i])
        }
      }

      if (missingFields.length > 0) {
        return res.status(400).json({message: "Missing required fields", missingFields})
      }

      next()
    }
  },

  getUser(req, res, next) {
    User.findOne({email: req.body.email}, (err, user) => {
      if (err) {
        console.log(err)
        res.sendStatus(500).json({message: "Unknown database error"})
      }
      if (!user)
        return res.status(401).json({message: "No user with that email"})

      req.user = user
      next()
    })
  },

  checkNewPasswordConfirm(req, res, next) {
    if (req.body.newPassword != req.body.newPasswordConfirm)
      return res.sendStatus(401).json({message: "newPassword and newPasswordConfirm do not match"})
    next()
  },

  changePassword(req, res) {
    req.user.password = req.user.generateHash(req.body.newPassword)
    req.user.save()
      .then((user) => {
        res.status(200).json({message: "Password successfully changed"})

        mailer.sendEmail("passwordChanged", user.email, {
            name: user.profileName
          })
          .then((info) => {console.log("Message sent: %s", info.messageId)})
          .catch((err) => {console.log(err)})
      })
      .catch((err) => {
        console.log(err)
        return res.status(500)
      })
  }
}
