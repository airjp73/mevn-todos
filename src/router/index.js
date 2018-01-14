var express = require("express")
var api = express.Router()

//nested routers
var localLogin = require('./local-login')

api.use(localLogin)

module.exports = api
