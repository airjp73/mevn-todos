var express = require("express")
var api  = express.Router()
var User = require("../../models/user.js")

//custom middleware
var requireLoggedIn = require("../middleware/requireLoggedIn.js")
var requireFields = require("require-fields")
var authenticate = require('../middleware/authenticate')

//passport strategies
var configPassport = require('./configPassport')
configPassport()

//controllers
var controllers = require("./controllers")

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
  authenticate('local-login'),
  controllers.login
)

api.route("/logout").post(
  requireLoggedIn,
  controllers.logout
)

api.route("/signup").post(
  requireFields(["email", "password"]),
  authenticate('local-signup'),
  controllers.signup
)

api.route("/resendConfirmation").post(
  requireLoggedIn,
  controllers.resendConfirmation
)

api.route("/changePassword").post(
  requireLoggedIn,
  requireFields(["email", "password", "newPassword"]),
  authenticate('local-login'),
  controllers.changePassword
)

api.route("/forgotPassword").post(
  requireFields(["email"]),
  controllers.forgotPassword
)

////Gets
api.route("/confirmEmail/:confirmEmailToken").get(
  controllers.confirmEmail
)

api.route("/resetPassword").get(
  controllers.resetPassword
)

module.exports = api
