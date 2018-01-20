"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')

var mocks = require('../../../testMocks')
var proxyquire = require('proxyquire')
var resendConfirmation = proxyquire('./resendConfirmation', {
  '../../../email': mocks.email,
  '../../../models/user': mocks.UserModel
})

describe("resendConfirmation", () => {
  describe("success case", () => {

    var req = {
      user: {
        id: mocks.user.id
      }
    }

    before(() => {
      mocks.reset()
      resendConfirmation(req, mocks.res, mocks.next)
    })

    it("should not error", () => {
      sinon.assert.notCalled(mocks.next)
    })

    it("should call user.findOne and supply needed projection", () => {
      sinon.assert.called(mocks.UserModel.findOne)
      var proj = mocks.UserModel.findOne.getCall(0).args[1]
      expect(proj).to.equal("+confirmEmailToken")
    })

    it("should sendStatus 202", () => {
      sinon.assert.called(mocks.status)
      var status = mocks.status.getCall(0).args[0]
      expect(status).to.equal(202)
    })

    it("should send email with link", () => {
      sinon.assert.called(mocks.email.send)
      var options = mocks.email.send.getCall(0).args[0]
      expect(options.template).to.equal("confirmEmail")
      expect(options.locals.link).to.equal("http://" + process.env.HOST + "/confirmEmail?token=" + mocks.vals.token)
    })
  })

  describe("failure case: email already confirmed", () => {
    var req = {
      headers: {
        host: "localhost"
      },
      user: {
        id: mocks.user.id
      }
    }

    before(() => {
      mocks.reset()
      mocks.user.emailConfirmed = true
      resendConfirmation(req, mocks.res, mocks.next)
    })

    it("should not error", () => {
      sinon.assert.notCalled(mocks.next)
    })

    it("should sendStatus 403", () => {
      sinon.assert.called(mocks.status)
      var status = mocks.status.getCall(0).args[0]
      expect(status).to.equal(403)
    })

    it("should not send email", () => {
      sinon.assert.notCalled(mocks.email.send)
    })
  })
})
