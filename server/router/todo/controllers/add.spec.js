"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var add = require('./add.js')

var mocks = require('../../../testMocks')
var add = require('./add.js')

////////////////////tests
describe("add todo", () => {
  it("should add todo to todos array", async () => {
    var req = {
      user: {
        todos: [],
        save: sinon.stub()
      },
      body: {
        todo: {text:"hello"}
      }
    }
    req.user.save.resolves(req.user)

    await add(req, mocks.res, mocks.next)

    sinon.assert.called(mocks.status)
    expect(mocks.status.getCall(0).args[0]).to.equal(200)
    expect(req.user.todos.length).to.equal(1)
    expect(req.user.todos[0]).to.equal(req.body.todo)
    sinon.assert.called(req.user.save)
    sinon.assert.notCalled(mocks.next)
  })
})
