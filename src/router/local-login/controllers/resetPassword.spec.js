"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')

var mocks = require('../../../testMocks')
var proxyquire = require('proxyquire')
var resetPassword = proxyquire('./resetPassword', {
  '../../../email': mocks.email,
  '../../../models/user': mocks.UserModel
})

describe("resetPassword", () => {
  describe("success case", () => {

    var req = {
      body: {
        resetPasswordToken: mocks.vals.token,
        newPassword: "newPassword"
      }
    }

    before(() => {
      mocks.reset()
      mocks.user.resetPasswordExpires = Date.now() + 360000
      resetPassword(req, mocks.res, mocks.next)
    })

    it("should not error", () => {
      sinon.assert.notCalled(mocks.next)
    })

    it("should set password to newPasswordhash and remove resetPassword fields", () => {
      sinon.assert.calledOnce(mocks.user.save)
      var user = mocks.user.save.getCall(0).args[0]
      expect(mocks.user.password).to.equal(req.body.newPassword + mocks.vals.hashSuffix)
      expect(mocks.user.resetPasswordExpires).to.be.undefined
      expect(mocks.user.resetPasswordToken).to.be.undefined
    })

    it("should call User.findOne", () => {
      sinon.assert.called(mocks.UserModel.findOne)
      var proj = mocks.UserModel.findOne.getCall(0).args[1]
      expect(proj).to.equal("+resetPasswordToken +resetPasswordExpires")
    })

    it("should sendStatus 202", () => {
      sinon.assert.called(mocks.status)
      var status = mocks.status.getCall(0).args[0]
      expect(status).to.equal(200)
    })

    it("should send email", () => {
      sinon.assert.called(mocks.email.send)
      var options = mocks.email.send.getCall(0).args[0]
      expect(options.template).to.equal("passwordChanged")
      expect(options.message.to).to.equal(mocks.user.email)
    })
  })

  describe("failure case: token expired", () => {
    var req = {
      body: {
        resetPasswordToken: mocks.vals.token,
        newPassword: "newPassword"
      }
    }

    before(() => {
      mocks.reset()
      mocks.user.resetPasswordToken = mocks.vals.token
      mocks.user.resetPasswordExpires = Date.now() - 360000
      resetPassword(req, mocks.res, mocks.next)
    })

    it("should not error", () => {
      sinon.assert.notCalled(mocks.next)
    })

    it("should sendStatus 403", () => {
      sinon.assert.called(mocks.status)
      var status = mocks.status.getCall(0).args[0]
      expect(status).to.equal(403)
    })

    it("should remove resetPassword fields and not change password", () => {
      sinon.assert.calledOnce(mocks.user.save)
      var user = mocks.user.save.getCall(0).args[0]
      expect(mocks.user.password).to.not.equal(req.body.newPassword + mocks.vals.hashSuffix)
      expect(mocks.user.resetPasswordExpires).to.be.undefined
      expect(mocks.user.resetPasswordExpires).to.be.undefined
    })

    it("should not send email", () => {
      sinon.assert.notCalled(mocks.email.send)
    })
  })

  describe("failure case: user not found", () => {
    var req = {
      body: {
        resetPasswordToken: 123132123,
        newPassword: "newPassword"
      }
    }

    before(() => {
      mocks.reset()
      mocks.user.resetPasswordToken = mocks.vals.token
      mocks.user.resetPasswordExpires = Date.now() + 360000
      mocks.UserModel.findOne.returns(null)
      resetPassword(req, mocks.res, mocks.next)
    })

    it("should not error", () => {
      sinon.assert.notCalled(mocks.next)
    })

    it("should sendStatus 404", () => {
      sinon.assert.called(mocks.status)
      var status = mocks.status.getCall(0).args[0]
      expect(status).to.equal(404)
    })

    it("should not send email or updateUser", () => {
      sinon.assert.notCalled(mocks.user.save)
      sinon.assert.notCalled(mocks.email.send)
    })
  })
})
