"use strict"

var sinon = require('sinon')
var sandbox = sinon.createSandbox()
var crypto = require('crypto')

var buffer = crypto.randomBytes(32)
var vals = {
  buffer,
  token: buffer.toString('hex'),
  hashSuffix: "hash"
}

var user = {
  id: 1234,
  email: "test@user.com",
  password: "password" + vals.hashSuffix,
  passwordNoHash: "password",
  confirmEmailToken: vals.token,
  emailConfirmed: false,
  resetPasswordToken: vals.token,
  resetPasswordExpires: new Date(),
  save: sandbox.stub(),
  validPassword: sandbox.stub(),
  setPassword: sandbox.stub(),
  genConfirmEmailToken: sandbox.stub(),
  genResetPasswordToken: sandbox.stub(),
  toJSON: sandbox.stub()
}

var genConfirmFake = () => {
  user.confirmEmailToken = vals.token
}

var genResetFake = () => {
  user.resetPasswordToken = vals.token
  user.resetPasswordExpires = new Date( Date.now() + 360000 )
}

var validPassFake = (password) => {
  //pretend encryption
  return password + vals.hashSuffix == user.password
}

var setPassFake = (password) => {
  //pretend encryption
  user.password = password + vals.hashSuffix
}

var email = {
  send: sandbox.spy()
}

var crypto = {
  randomBytes: sandbox.stub()
}

var status = sandbox.stub()
var res = {
  sendStatus: status,
  status: status,
  json: sandbox.stub()
}
var next = sandbox.stub()


////Mock User model
var UserModel = function() {
  return user
}
UserModel.findOne = sandbox.stub()
UserModel.findOrCreate = sandbox.stub()

/*var UserModel = {
  findOne: sandbox.stub(),
  findOrCreate: sandbox.stub()
}*/

function reset() {
  sandbox.reset()

  user.id = 1234,
  user.email = "test@user.com"
  user.password = "password" + vals.hashSuffix
  user.confirmEmailToken = vals.token
  user.emailConfirmed = false
  user.resetPasswordToken = vals.token
  user.save.returns(user)
  user.validPassword.callsFake(validPassFake)
  user.setPassword.callsFake(setPassFake)
  user.genConfirmEmailToken.callsFake(genConfirmFake)
  user.genResetPasswordToken.callsFake(genResetFake)
  user.toJSON.returns(user)

  UserModel.findOne.returns(user)

  next.callsFake((err, req, res, next) => {
    if (err)
      console.log(err)
  })


  crypto.randomBytes.returns(vals.buffer)

  status.returns(res)
}

reset()

module.exports = {
  sandbox,
  user,
  UserModel,
  email,
  crypto,
  vals,
  res,
  status,
  next,
  reset
}
