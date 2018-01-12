var express = require("express")
var api = express.Router()

var handleErrors = require("./middleware/handleErrors.js")
api.use(handleErrors)

//nested routers
var localLogin = require('./local-login')

app.use(localLogin)

module.exports = api
