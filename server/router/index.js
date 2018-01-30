var express = require("express")
var api = express.Router()

//nested routers
var localLogin = require('./local-login')
var todo = require('./todo')
var facebook = require('./facebook')

api.use(localLogin)
api.use('/facebook', facebook)
api.use('/todo', todo)


module.exports = api
