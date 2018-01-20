"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var proxyquire = require('proxyquire')

var mocks = require('../../../testMocks')
var signup = proxyquire('./signup.js', {
  '../../../email': mocks.email
})

describe("signup", () => {
  describe("success case", () => {

    var req = {
      user: {
        email: mocks.user.email,
        confirmEmailToken: mocks.vals.token,
        toJSON: sinon.spy()
      }
    }

    before(() => {
      mocks.reset()
      signup(req, mocks.res, mocks.next)
    })

    it("should not error", () => {
      sinon.assert.notCalled(mocks.next)
    })

    it("should sendStatus 200", () => {
      sinon.assert.called(mocks.status)
      var status = mocks.status.getCall(0).args[0]
      expect(status).to.equal(200)
    })

    it("should send email with link", () => {
      sinon.assert.called(mocks.email.send)
      var options = mocks.email.send.getCall(0).args[0]
      expect(options.template).to.equal("confirmEmail")
      expect(options.locals.link).to.equal("http://" + process.env.HOST + "/confirmEmail?token=" + mocks.vals.token)
    })
  })
})
