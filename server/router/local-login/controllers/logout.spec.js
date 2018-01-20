"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var logout = require('./logout')

var mocks = require('../../../testMocks')

describe("logout", () => {

  var req = {
    logout: sinon.spy()
  }

  before(() => {
    mocks.reset()
    logout(req, mocks.res, mocks.next)
  })

  it("should not error", () => {
    sinon.assert.notCalled(mocks.next)
  })

  it("should call req.logout", () => {
    sinon.assert.calledOnce(req.logout)
  })

  it("should sendStatus 200", () => {
    sinon.assert.calledOnce(mocks.status)
    var status = mocks.status.getCall(0).args[0]
    expect(status).to.equal(200)
  })
})
