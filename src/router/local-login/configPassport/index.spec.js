var chai = require('chai')
var expect = chai.expect
var proxyquire = require('proxyquire')
var sinon = require('sinon')

var loginMock = {hi: "hi"}
var signupMock = {bye: "bye"}
var passport = {
  use: sinon.spy()
}
var configPassport = proxyquire('./index.js', {
  'passport' : passport,
  './local-login-strategy' : loginMock,
  './local-signup-strategy' : signupMock
})

describe("configPassport", () => {
  it("should export a function", () => {
    expect(configPassport).to.be.a('function')
  })

  describe("function behavior", () => {
    it("should call passport.use", () => {
      configPassport()
      sinon.assert.calledWith(passport.use, 'local-login', loginMock)
      sinon.assert.calledWith(passport.use, 'local-signup', signupMock)
    })
  })
})
