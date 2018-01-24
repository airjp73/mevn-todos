"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var sandbox = sinon.createSandbox()

var remove = require('./remove.js')

////////////////////mocks
var status = sandbox.spy()
var res = {
  status,
  sendStatus: status
}

var next = sandbox.spy()

////////////////////tests
describe("remove todo", () => {
  afterEach(() => {
    sandbox.reset()
  })

  it("should remove todo from todos array", () => {
    var req = {
      user: {
        todos: [{text:"hi"},{text:"hello"}],
        save: sandbox.spy()
      },
      body: {
        todo: {text:"hello"}
      }
    }

    remove(req, res, next)

    expect(req.user.todos.length).to.equal(1)
    expect(req.user.todos[0].text).to.not.equal(req.body.todo.text)
    sinon.assert.called(req.user.save)
    sinon.assert.notCalled(next)
  })

  it("should work for more complex todos", () => {
    var req = {
      user: {
        todos: [
          {field1: 1, field2: 2, field3: "george"},
          {field1: 1, field2: 2, field3: "bob"}
        ],
        save: sandbox.spy()
      },
      body: {
        todo: {field2: 2, field3: "bob"}
      }
    }

    remove(req, res, next)

    expect(req.user.todos.length).to.equal(1)
    expect(req.user.todos[0].field3).to.equal("george")
    sinon.assert.called(req.user.save)
    sinon.assert.notCalled(next)
  })
})
