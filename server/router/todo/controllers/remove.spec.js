"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var sandbox = sinon.createSandbox()

var mocks = require('../../../testMocks')
var remove = require('./remove.js')

////////////////////tests
describe("remove todo", () => {
  afterEach(() => {
    sandbox.reset()
  })

  it("should remove todo from todos array", async () => {
    var req = {
      user: {
        todos: [{text:"hi"},{text:"hello"}],
        save: sandbox.stub()
      },
      body: {
        todo: {text:"hello"}
      }
    }
    req.user.save.resolves(req.user)

    await remove(req, mocks.res, mocks.next)

    expect(req.user.todos.length).to.equal(1)
    expect(req.user.todos[0].text).to.not.equal(req.body.todo.text)
    sinon.assert.called(req.user.save)
    sinon.assert.notCalled(mocks.next)
  })

  it("should work for more complex todos", async () => {
    var req = {
      user: {
        todos: [
          {field1: 1, field2: 2, field3: "george"},
          {field1: 1, field2: 2, field3: "bob"}
        ],
        save: sandbox.stub()
      },
      body: {
        todo: {field2: 2, field3: "bob"}
      }
    }
    req.user.save.resolves(req.user)

    await remove(req, mocks.res, mocks.next)

    expect(req.user.todos.length).to.equal(1)
    expect(req.user.todos[0].field3).to.equal("george")
    sinon.assert.called(req.user.save)
    sinon.assert.notCalled(mocks.next)
  })
})
