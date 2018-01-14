"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var proxyquire = require('proxyquire')

var mocks = require('../../../testMocks')
var forgotPassword = proxyquire('./forgotPassword', {
  '../../../email': mocks.email,
  '../../../models/user': mocks.UserModel,
  'crypto': mocks.crypto
})

describe("forgotPassword", () => {
  describe("success case", () => {

    var req = {
      body: {
        email: mocks.user.email
      }
    }

    before(() => {
      mocks.reset()
      forgotPassword(req, mocks.res, mocks.next)
    })

    it("should not error", () => {
      sinon.assert.notCalled(mocks.next)
    })

    it("should call User.findOne", () => {
      sinon.assert.called(mocks.UserModel.findOne)
    })

    it("should create resetPasswordToken and resetPasswordTokenExpires and updateUser", () => {
      sinon.assert.called(mocks.user.save)
      expect(mocks.user.resetPasswordToken).to.equal(mocks.vals.token)
      expect(mocks.user.resetPasswordExpires).to.be.above(new Date())
    })

    it("should sendStatus 200", () => {
      sinon.assert.called(mocks.status)
      var status = mocks.status.getCall(0).args[0]
      expect(status).to.equal(202)
    })

    it("should send email with link", () => {
      sinon.assert.called(mocks.email.send)
      var options = mocks.email.send.getCall(0).args[0]
      expect(options.message.to).to.equal(mocks.user.email)
      expect(options.template).to.equal("forgotPassword")
      expect(options.locals.link).to.equal("http://" + process.env.HOST + "/resetPassword?token=" + mocks.vals.token)
    })
  })

  describe("failure case: no user found", () => {
    var req = {
      body: {
        email: "nomatch"
      }
    }

    before(() => {
      mocks.reset()
      mocks.UserModel.findOne.returns(null)
      forgotPassword(req, mocks.res, mocks.next)
    })

    it("should not error", () => {
      sinon.assert.notCalled(mocks.next)
    })

    it("should sendStatus 404", () => {
      sinon.assert.called(mocks.status)
      var status = mocks.status.getCall(0).args[0]
      expect(status).to.equal(404)
    })

    it("no updateUser or email", () => {
      sinon.assert.notCalled(mocks.user.save)
      sinon.assert.notCalled(mocks.email.send)
    })
  })
})
