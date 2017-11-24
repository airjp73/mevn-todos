var express = require("express")
var passport = require("passport")
var api = express.Router()
var User = require("../models/user.js")
var mailer = require("../config/mailer.js")
var crypto = require("crypto")
var middle = require("./middleware.js")

//Error handling
api.use((error, req, res, next) => {
  console.log(err)
  res.sendStatus(500)
})

api.route("/login").post(
  middle.requireFields(["email", "password"]),
  passport.authenticate('local-login'),
  (req, res) => {
    return res.status(200).json(req.user)
  }
)

api.route("/signup").post(
  middle.requireFields(["email", "profileName", "password"]),
  passport.authenticate('local-signup'),
  (req, res, next) => {
    res.sendStatus(200)

    //now send confirmation email
    mailer.sendEmail("emailConfirm", req.user.email, {
        name: req.user.profileName,
        link: "http://" + req.headers.host + "/emailConfirm/" + req.user.confirmEmailToken,
      })
      .then((info) => {console.log("Message sent: %s", info.messageId)})
      .catch((err) => {console.log(err)})
  }
)

api.route("/resendConfirmation").post(
  middle.checkAuth,
  async (req, res, next) => {
    //try catch?
    var user = await User.findOne({email: req.user.email}, "+confirmEmailToken")
    if (!user)
      return res.status(401).json({message: "User does not exist"})

    var info = await mailer.sendEmail("emailConfirm", user.email, {
        name: user.profileName,
        link: "http://" + req.headers.host + "/emailConfirm/" + user.confirmEmailToken,
      })

    console.log("Message sent: %s", info.messageId)
    res.sendStatus(200)
  }
)

api.route("/confirmEmail").post(
  middle.requireFields(["confirmEmailToken"]),
  (req, res, next) => {
    User.findOne({confirmEmailToken: req.body.confirmEmailToken}, "+confirmEmailToken")
      .then((user) => {
        if (!user)
          return res.status(401).json({message: "Invalid confirmation token"})

        user.confirmEmailToken = undefined
        user.emailConfirmed = true
        user.save()
          .then((user) => {
            res.sendStatus(200)

            mailer.sendEmail("emailConfirmThankYou", user.email, {
                name: user.profileName
              })
              .then((info) => {console.log("Message sent: %s", info.messageId)})
              .catch((err) => {console.log(err)})
          })
      })
      .catch(next)
  }
)

api.route("/logout").post(
  (req, res) => {
    req.logout()
    return res.status(200).json({message: "Logout Successfull"})
  }
)

api.route("/changePassword").post(
  middle.checkAuth,
  middle.requireFields(["email", "password", "newPassword", "newPasswordConfirm"]),
  passport.authenticate('local-login'),
  middle.checkNewPasswordConfirm,
  middle.changePassword
)

api.route("/forgotPassword").post(
  middle.requireFields(["email"]),
  middle.getUser,
  (req, res, next) => {
    req.user.resetPasswordToken = crypto.randomBytes(16).toString('hex')
    req.user.resetPasswordExpires = Date.now() + 3600000 //1 hour
    req.user.save()
      .then((user) => {
        res.sendStatus(200)

        mailer.sendEmail("forgotPassword", user.email, {
            name: user.profileName,
            link: "http://" + req.headers.host + "/reset/" + req.user.resetPasswordToken
          })
          .then((info) => {console.log("Message sent: %s", info.messageId)})
          .catch((err) => {console.log(err)})
      })
      .catch(next)
  }
)

api.route("/resetPassword").post(
  middle.requireFields(["email", "token", "newPassword", "newPasswordConfirm"]),
  middle.checkNewPasswordConfirm,
  middle.getUser,
  (req, res, next) => {
    console.log(req.body.token)
    console.log(req.user.restPasswordToken)
    if (req.body.token == req.user.resetPasswordToken && Date.now() < req.user.resetPasswordExpires) {
      req.user.password = req.user.generateHash(req.body.newPassword)
      req.user.resetPasswordToken = undefined
      req.user.resetPasswordExpires = undefined
      req.user.save()
        .then(next())
        .catch(next)
    }
    else {
      return res.status(401).json({message: "Reset password token expired or does not match"})
    }
  },
  middle.changePassword
)

//testing only
api.route("/checkAuth").post(
  middle.checkAuth,
  (req, res) => {
    res.sendStatus(200)
  }
)

module.exports = api;
