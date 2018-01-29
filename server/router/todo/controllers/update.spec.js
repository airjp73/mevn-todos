"use strict"

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var add = require('./add.js')

var mocks = require('../../../testMocks')
var update = require('./update.js')

////////////////////tests
describe("update todo", () => {
  beforeEach(() => {
    mocks.reset()
  })

  it("should update todo from todos array", async () => {
    var req = {
      user: {
        todos: [{text:"hi"}, {text:"hello"}],
        save: sinon.stub(),
        markModified: sinon.spy()
      },
      body: {
        todo: {text:"hello"},
        changes: {text:"boo"}
      }
    }
    req.user.save.resolves(req.user)

    await update(req, mocks.res, mocks.next)

    sinon.assert.notCalled(mocks.next)
    sinon.assert.called(mocks.res.status)
    expect(mocks.status.getCall(0).args[0]).to.equal(200)
    expect(req.user.todos[1].text).to.equal(req.body.changes.text)
    sinon.assert.called(req.user.save)

  })
})
