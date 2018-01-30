var express = require("express")
var api = express.Router()

//nested routers
var localLogin = require('./local-login')
var facebook = require('./facebook')
var google = require('./google')
var todo = require('./todo')

api.use(localLogin)
api.use('/facebook', facebook)
api.use('/google', google)
api.use('/todo', todo)


module.exports = api
