"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var add = require('./add.js')

var mocks = require('../../../testMocks')
var proxyquire = require('proxyquire')
var update = require('./update.js')

////////////////////mocks
var req = {
  user: {
    todos: [{text:"hi"},{text:"hello"}],
    save: sinon.spy()
  },
  body: {
    todo: {text:"hello"},
    changes: {text:"boo"}
  }
}

var status = sinon.spy()
var res = {
  status,
  sendStatus: status
}

var next = sinon.spy()

////////////////////tests
describe("update todo", () => {
  it("should update todo from todos array", () => {
    update(req, res, next)

    expect(req.user.todos[1].text).to.equal(req.body.changes.text)
    sinon.assert.called(req.user.save)
    sinon.assert.notCalled(next)
  })
})
