var mongoose = require("mongoose")
var bcrypt = require("bcrypt-nodejs")
var crypto = require('crypto')

var userSchema = new mongoose.Schema({
  password: {type: String, select: false},
  confirmEmailToken: {type: String, select: false},
  emailConfirmed: {type: Boolean, default: false},
  resetPasswordToken: {type: String, select: false},
  resetPasswordExpires: {type: Date, select: false},

  email: String,
  profileName: String,
  todos: []
})

userSchema.methods.setPassword = async (password) => {
  try {
    var salt = await bcrypt.genSalt(8)
    this.password = await bcrypt.hash(password, salt, null)
  }
  catch (err) {
    throw err
  }
}

userSchema.methods.validPassword = async (password) => {
  try {
    if (!this.password)
      throw new Error("Method validPassword -- User data does not contain password")
    return await bcrypt.compare(password, this.password)
  }
  catch(err) {
    throw err
  }
}

userSchema.methods.removeSensitiveInfo = function() {
  this.password             = undefined
  this.confirmEmailToken    = undefined
  this.resetPasswordToken   = undefined
  this.resetPasswordExpires = undefined
}

userSchema.methods.genConfirmEmailToken = () => {
  this.confirmEmailToken = crypto.randomBytes(16).toString('hex')
}

userSchema.methods.genResetPasswordToken = () => {
  this.resetPasswordToken = crypto.randomBytes(32).toString('hex')
}

userSchema.statics.findUserFromRequest = function(field = null, projection = "") {

  return async (req, res, next) => {
    try {

      var select = {}
      if (field) {
        if (!req.body[field])
          return res.sendStatus(404)
        select[field] = req.body[field] || ""
      }
      else if (req.user)
        select = {_id: req.user._id}
      else
        throw new Error("Cannot find user -- No selection or invalid selection")

      req.user = await this.findOne(select, projection)
      if (!req.user)
        return res.sendStatus(404)

      return next()
    }
    catch (err) { next(err) }

  }
}

//create model
module.exports = mongoose.model("User", userSchema)
