var express = require("express")
var api = express.Router()

//nested routers
var localLogin = require('./local-login')
var todo = require('./todo')

api.use(localLogin)
api.use('/todo', todo)

module.exports = api
