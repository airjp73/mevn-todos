var chai = require('chai')
var chaiPassport = require('chai-passport-strategy')
chai.use(chaiPassport)
var expect = chai.expect
var sinon = require('sinon')

var mocks = require('../../../testMocks')
var passport = {
  use: sinon.spy()
}
var strategy = {}

var proxyquire = require('proxyquire')
var configPassport = proxyquire('./index.js', {
  'passport' : passport,
  '../../../models/user': mocks.UserModel
})

describe("configPassport-facebook", () => {
  it("should export a function", () => {
    expect(configPassport).to.be.a('function')
  })

  describe("function behavior", () => {
    it("should call passport.use", () => {
      configPassport()
      sinon.assert.called(passport.use)
      strategy = passport.use.getCall(0).args[0]
    })
  })
})
