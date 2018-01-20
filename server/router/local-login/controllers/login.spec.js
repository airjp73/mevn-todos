"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var login = require('./login')

var mocks = require('../../../testMocks')

describe("login", () => {

  var req = {
    user: {
      toJSON: sinon.spy()
    }
  }

  before(() => {
    mocks.reset()
    login(req, mocks.res, mocks.next)
  })

  it("should not error", () => {
    sinon.assert.notCalled(mocks.next)
  })

  it("should sendStatus 200", () => {
    sinon.assert.calledOnce(mocks.status)
    var status = mocks.status.getCall(0).args[0]
    expect(status).to.equal(200)
  })
})
