var chai = require('chai')
var should = chai.should()
var expect = chai.expect
var sinon = require('sinon')
var User = require('./user.js')

var bcrypt = require('bcrypt-nodejs')

var user = new User()

describe("User model", () => {
  it("setPassword should encrypt and set password", () => {
    user.setPassword("testPassword")
    var isMatch = bcrypt.compareSync("testPassword", user.password)
    expect(isMatch).to.be.true
  })

  describe("validPassword", () => {
    it("should return true if match", () => {
      user.password = bcrypt.hashSync("testPassword", bcrypt.genSaltSync(8))
      var isMatch = bcrypt.compareSync("testPassword", user.password)
      expect(isMatch).to.be.true
    })

    it("should return false if not match", () => {
      user.password = bcrypt.hashSync("testPassword", bcrypt.genSaltSync(8))
      var isMatch = bcrypt.compareSync("nomatch", user.password)
      expect(isMatch).to.be.false
    })
  })

  it("toJSON should remove sensitive info", () => {
    user.__v = 0
    user._id = "123123"
    user.password             = "testPass"
    user.confirmEmailToken    = "testToken"
    user.resetPasswordToken   = "testToken"
    user.resetPasswordExpires = new Date()

    var userJson = user.toJSON()

    expect(userJson.__v).to.be.undefined
    expect(userJson._id).to.be.undefined
    expect(userJson.password).to.be.undefined
    expect(userJson.confirmEmailToken).to.be.undefined
    expect(userJson.resetPasswordToken).to.be.undefined
    expect(userJson.resetPasswordExpires).to.be.undefined
  })

  it("genConfirmEmailToken should populate confirmEmailToken", () => {
    user.confirmEmailToken = undefined
    user.genConfirmEmailToken()
    expect(user.confirmEmailToken).to.not.be.undefined
  })

  it("genResetPasswordToken should populate resetPasswordToken and resetPasswordExpires", () => {
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    user.genResetPasswordToken()
    expect(user.resetPasswordToken).to.not.be.undefined
    expect(user.resetPasswordExpires).to.not.be.undefined
    expect(user.resetPasswordExpires).to.be.above(new Date())
  })
})
