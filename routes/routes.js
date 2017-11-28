var express = require("express")
var passport = require("passport")
var api = express.Router()
var User = require("../models/user.js")

//custom middleware
var requireLoggedIn = require("./middleware/requireLoggedIn.js")
var requireFields = require("./middleware/requireFields.js")
var handleErrors = require("./middleware/handleErrors.js")

api.use(handleErrors)

//controllers
var controllers = require("./controllers.js")

//Routes
  //login
  //logout
  //signup
  //resendConfirmation
  //confirmEmail
  //changePassword
  //forgotPassword
  //resetPassword

api.route("/login").post(
  requireFields(["email", "password"]),
  passport.authenticate('local-login'),
  controllers.login
)

api.route("/logout").post(
  controllers.logout
)

api.route("/signup").post(
  requireFields(["email", "profileName", "password"]),
  passport.authenticate('local-signup'),
  controllers.signup
)

api.route("/resendConfirmation").post(
  requireLoggedIn,
  User.findUserFromRequest(null, "+confirmEmailToken"),
  controllers.resendConfirmation
)

api.route("/confirmEmail").post(
  requireFields(["confirmEmailToken"]),
  User.findUserFromRequest("confirmEmailToken", "+confirmEmailToken"),
  controllers.confirmEmail
)

api.route("/changePassword").post(
  requireLoggedIn,
  requireFields(["email", "password", "newPassword"]),
  passport.authenticate('local-login'),
  controllers.changePassword
)

api.route("/forgotPassword").post(
  requireFields(["email"]),
  User.findUserFromRequest("email"),
  controllers.forgotPassword
)

api.route("/resetPassword").post(
  requireFields(["resetPasswordToken", "newPassword"]),
  User.findUserFromRequest("resetPasswordToken", "+resetPasswordToken +resetPasswordExpires"),
  controllers.resetPassword
)

module.exports = api;
