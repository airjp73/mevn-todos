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

  it("removeSensitiveInfo should remove sensitive fields", () => {
    user.password             = "testPass"
    user.confirmEmailToken    = "testToken"
    user.resetPasswordToken   = "testToken"
    user.resetPasswordExpires = new Date()

    user.removeSensitiveInfo()

    expect(user.password).to.be.undefined
    expect(user.confirmEmailToken).to.be.undefined
    expect(user.resetPasswordToken).to.be.undefined
    expect(user.resetPasswordExpires).to.be.undefined
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
