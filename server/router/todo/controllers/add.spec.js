"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var add = require('./add.js')

var mocks = require('../../../testMocks')
var proxyquire = require('proxyquire')
var add = require('./add.js')

////////////////////mocks
var req = {
  user: {
    todos: [],
    save: sinon.spy()
  },
  body: {
    todo: {text:"hello"}
  }
}

var status = sinon.spy()
var res = {
  status,
  sendStatus: status
}

var next = sinon.spy()

////////////////////tests
describe("add todo", () => {
  it("should add todo to todos array", () => {
    add(req, res, next)

    expect(req.user.todos.length).to.equal(1)
    expect(req.user.todos[0]).to.equal(req.body.todo)
    sinon.assert.called(req.user.save)
    sinon.assert.notCalled(next)
  })
})
