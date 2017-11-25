var mongoose = require("mongoose")
var bcrypt = require("bcrypt-nodejs")

var userSchema = new mongoose.Schema({
  password: {type: String, select: false},
  confirmEmailToken: {type: String, select: false},
  resetPasswordToken: {type: String, select: false},
  resetPasswordExpires: {type: Date, select: false},

  email: String,
  emailConfirmed: {type: Boolean, default: false},
  profileName: String,
  todos: []
})

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

userSchema.methods.validPassword = function(password) {
  if (!this.password) {
    console.log("Method validPassword -- User data does not contain password")
    throw err
  }
  return bcrypt.compareSync(password, this.password)
}

userSchema.methods.removeSensitiveInfo = function() {
  this.password             = undefined
  this.confirmEmailToken    = undefined
  this.resetPasswordToken   = undefined
  this.resetPasswordExpires = undefined
}

userSchema.statics.findUserFromRequest = function(field = null, projection = "") {

  return async (req, res, next) => {
    try {

      var select = {}
      if (field && req.body[field])
        select[field] = req.body[field]
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
