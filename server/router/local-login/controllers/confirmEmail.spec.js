"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var proxyquire = require('proxyquire')
var mocks = require('../../../testMocks')

var confirmEmail = proxyquire('./confirmEmail', {
  '../../../email': mocks.email,
  '../../../models/user': mocks.UserModel
})

describe("confirmEmail", () => {
  describe("success case", () => {

    var req = {
      params: {
        confirmEmailToken: mocks.vals.token
      },
      flash: sinon.spy()
    }

    before(() => {
      mocks.reset()
      confirmEmail(req, mocks.res, mocks.next)
    })

    it("should not error", () => {
      sinon.assert.notCalled(mocks.next)
    })

    it("should call User.findOne and supply needed projection", () => {
      sinon.assert.called(mocks.UserModel.findOne)
      var proj = mocks.UserModel.findOne.getCall(0).args[1]
      expect(proj).to.equal("+confirmEmailToken")
    })

    it("should change confirmEmailToken to undefined and emailConfirmed to true", () => {
      sinon.assert.called(mocks.user.save)
      expect(mocks.user.confirmEmailToken).to.be.undefined
      expect(mocks.user.emailConfirmed).to.be.true
    })

    it("should redirect to / with flash message", () => {
      sinon.assert.called(mocks.res.redirect)
      sinon.assert.called(req.flash)
      var msgName = req.flash.getCall(0).args[0]
      expect(msgName).to.equal('info')
    })

    it("should send email", () => {
      sinon.assert.called(mocks.email.send)
      var options = mocks.email.send.getCall(0).args[0]
      expect(options.template).to.equal("welcome")
    })
  })

  describe("failure case: no user found", () => {
    var req = {
      params: {
        confirmEmailToken: 1232121212
      },
      flash: sinon.spy()
    }

    before(() => {
      mocks.reset()
      mocks.UserModel.findOne.returns(null)
      confirmEmail(req, mocks.res, mocks.next)
    })

    it("should not error", () => {
      sinon.assert.notCalled(mocks.next)
    })

    it("should redirect to / with flash message", () => {
      sinon.assert.called(mocks.res.redirect)
      sinon.assert.called(req.flash)
      var msgName = req.flash.getCall(0).args[0]
      expect(msgName).to.equal('info')
    })

    it("no user.save or email", () => {
      sinon.assert.notCalled(mocks.user.save)
      sinon.assert.notCalled(mocks.email.send)
    })
  })
})
