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

userSchema.methods.setPassword = async function(password) {
  try {
    var salt = await bcrypt.genSalt(8)
    this.password = await bcrypt.hash(password, salt, null)
  }
  catch (err) {
    throw err
  }
}

userSchema.methods.validPassword = async function(password) {
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

userSchema.methods.genConfirmEmailToken = function() {
  this.confirmEmailToken = crypto.randomBytes(16).toString('hex')
}

userSchema.methods.genResetPasswordToken = function() {
  this.resetPasswordToken = crypto.randomBytes(32).toString('hex')
}

//create model
module.exports = mongoose.model("User", userSchema)
