var mongoose = require("mongoose")
var bcrypt = require("bcrypt-nodejs")

var userSchema = mongoose.Schema({
  password: {type: String, select: false},
  confirmEmailToken: {type: String, select: false},
  resetPasswordToken: {type: String, select: false},
  resetPasswordExpires: {type: Date, select: false},

  email: String,
  emailConfirmed: {type: Boolean, default: false},
  profileName: String,
  todos: []
})

//generate hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

//validate password
userSchema.methods.validPassword = function(password) {
  if (!this.password) {
    console.log("Method validPassword -- User data does not contain password")
    throw err
  }
  return bcrypt.compareSync(password, this.password)
}

//create model
module.exports = mongoose.model("User", userSchema)
