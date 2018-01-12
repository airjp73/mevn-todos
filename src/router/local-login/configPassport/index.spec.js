var chai = require('chai')
var expect = chai.expect
var proxyquire = require('proxyquire')
var sinon = require('sinon')

var loginMock = {hi: "hi"}
var signupMock = {bye: "bye"}
var passport = {
  use: sinon.spy()
}
proxyquire('./index.js', {
  'passport' : passport,
  './local-login-strategy' : loginMock,
  './local-signup-strategy' : signupMock
})

var configPassport = require('./index.js')

describe("configPassport", () => {
  it("should export a function", () => {
    expect(configPassport).to.be.a('function')
  })

  describe("function behavior", () => {
    before(() => {
      configPassport()
    })
    it("should call passport.use", () => {
      sinon.assert.calledWith(passport.use, 'local-login', loginMock)
      sinon.assert.calledWith(passport.use, 'local-signup', signupMock)
    })
  })
})
