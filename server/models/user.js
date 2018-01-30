var mongoose = require("mongoose")
var bcrypt = require("bcrypt-nodejs")
var crypto = require('crypto')

var userSchema = new mongoose.Schema({
  password: {type: String, select: false},
  confirmEmailToken: {type: String, select: false},
  emailConfirmed: {type: Boolean, default: false},
  resetPasswordToken: {type: String, select: false},
  resetPasswordExpires: {type: Date, select: false},

  facebookId: {type: String, select: false},
  googleId: {type: String, select: false},

  email: String,
  profileName: String,
  todos: []
})

var toObj = {
  transform: (doc, ret, options) => {
    delete ret.__v
    delete ret._id
    delete ret.password
    delete ret.confirmEmailToken
    delete ret.resetPasswordToken
    delete ret.resetPasswordExpires
    delete ret.facebookId
    delete ret.googleId
  }
}

userSchema.set('toJSON', toObj)
userSchema.set('toObject', toObj)

userSchema.methods.setPassword = async function(password) {
  try {
    var salt = bcrypt.genSaltSync(8)
    this.password = bcrypt.hashSync(password, salt)
  }
  catch (err) {
    throw err
  }
}

userSchema.methods.validPassword = async function(password) {
  try {
    if (!this.password)
      throw new Error("Method validPassword -- User data does not contain password")
    return bcrypt.compareSync(password, this.password)
  }
  catch(err) {
    throw err
  }
}

userSchema.methods.genConfirmEmailToken = function() {
  this.confirmEmailToken = crypto.randomBytes(16).toString('hex')
}

userSchema.methods.genResetPasswordToken = function() {
  this.resetPasswordToken = crypto.randomBytes(32).toString('hex')
  this.resetPasswordExpires = new Date( Date.now() + 360000 )
}

//create model
module.exports = mongoose.model("User", userSchema)
