var express = require("express")
var api = express.Router()
var User = require("../../models/user.js")

//custom middleware
var requireLoggedIn = require("../middleware/requireLoggedIn.js")
var requireFields = require("require-fields")

//controllers
var controllers = require("./controllers")

api.route('/add').post(
  requireLoggedIn,
  requireFields(['todo']),
  controllers.add
)

api.route('/remove').post(
  requireLoggedIn,
  requireFields(["todo"]),
  controllers.remove
)

api.route('/update').post(
  requireLoggedIn,
  requireFields(["todo", "changes"]),
  controllers.update
)

module.exports = api
