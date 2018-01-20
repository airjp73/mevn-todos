"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')

var mocks = require('../../../testMocks')
var proxyquire = require('proxyquire')
var changePassword = proxyquire('./changePassword', {
  '../../../email': mocks.email,
  '../../../models/user': mocks.UserModel
})

describe("changePassword", () => {
  describe("success case", () => {

    var req = {
      body: {
        password: "password",
        newPassword: "newPassword"
      },
      user: {
        id: mocks.user.id
      }
    }

    before(() => {
      mocks.reset()
      changePassword(req, mocks.res, mocks.next)
    })

    it("should not error", () => {
      sinon.assert.notCalled(mocks.next)
    })

    it("should call getUser and supply all need fields to projection", () => {
      sinon.assert.called(mocks.UserModel.findOne)
      var proj = mocks.UserModel.findOne.getCall(0).args[1]
      expect(proj).to.equal("email password")
    })

    it("should call user.validPassword, user.setPassword and user.save", () => {
      sinon.assert.called(mocks.user.validPassword)
      sinon.assert.called(mocks.user.setPassword)
      sinon.assert.called(mocks.user.save)

      //hashSuffix is pretend encryption
      expect(mocks.user.password).to.equal(req.body.newPassword + mocks.vals.hashSuffix)
    })

    it("should sendStatus 200", () => {
      sinon.assert.called(mocks.status)
      var status = mocks.status.getCall(0).args[0]
      expect(status).to.equal(200)
    })

    it("should send email", () => {
      sinon.assert.called(mocks.email.send)
      var options = mocks.email.send.getCall(0).args[0]
      expect(options.template).to.equal("passwordChanged")
    })
  })

  describe("failure case: wrong password", () => {
    var req = {
      body: {
        password: "wrongPass",
        newPassword: "newPassword"
      },
      user: {
        id: mocks.user.id
      }
    }
    before(() => {
      mocks.reset()
      changePassword(req, mocks.res, mocks.next)
    })

    it("should not error", () => {
      sinon.assert.notCalled(mocks.next)
    })

    it("should sendStatus 401", () => {
      sinon.assert.called(mocks.status)
      var status = mocks.status.getCall(0).args[0]
      expect(status).to.equal(401)
    })

    it("no updateUser or email", () => {
      sinon.assert.notCalled(mocks.user.save)
      sinon.assert.notCalled(mocks.email.send)
    })
  })

  describe("failure case: no user found", () => {
    var req = {
      body: {
        password: "password",
        newPassword: "newPassword"
      },
      user: {
        id: 11111111
      }
    }

    before(() => {
      mocks.reset()
      mocks.UserModel.findOne.returns(null)
      changePassword(req, mocks.res, mocks.next)
    })

    it("should not error", () => {
      sinon.assert.notCalled(mocks.next)
    })

    it("should have status 404", () => {
      sinon.assert.called(mocks.status)
      var status = mocks.status.getCall(0).args[0]
      expect(status).to.equal(404)
    })
  })
})
