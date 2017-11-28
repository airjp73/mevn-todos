var sinon = require('sinon')
var chai = require('chai')
var expect = chai.expect
var requireFields = require('./requireFields.js')


var sandbox = sinon.createSandbox()
var next = sandbox.spy()
var res = {
  status: sandbox.stub(),
  json: sandbox.spy()
}
res.status.returns(res)


describe('requireFields middleware', () => {
  //should call next when all necessary fields are provided
  //should call next even if extra, unnecessary fields are provided
  //should send 400 and an array of missing fields if fields not provided
  //should send 400 and an array of missing fields if fields are provided but empty
  //should throw an error if no required fields are specified by the server
  afterEach(() => {
    sandbox.resetHistory()
  })

  it("should call next when all necessary fields are provided", () => {
    var fields = ["email", "password", "testtest", "hullaballoo"]
    var req = {body: {
      email: "test",
      password: "test",
      testtest: "test",
      hullaballoo: "test"
    }}

    requireFields(fields)(req, res, next)

    sinon.assert.called(next)
    sinon.assert.notCalled(res.status)
    sinon.assert.notCalled(res.json)
  })

  it("should call next even if extra, unnecessary fields are provided", () => {
    var fields =  ["email", "password", "testtest", "hullaballoo"]
    var req = {body: {
      email: "test",
      password: "test",
      testtest: "test",
      hullaballoo: "test",
      extra: "test",
      moreExtra: "test"
    }}

    requireFields(fields)(req, res, next)

    sinon.assert.called(next)
    sinon.assert.notCalled(res.status)
    sinon.assert.notCalled(res.json)
  })

  it("should send 400 and an array of missing fields if fields not provided or empty", () => {
    var fields =  ["email", "password", "testtest", "hullaballoo"]
    var missingFields = ["password", "testtest", "hullaballoo"]
    var req = {body: {
      email: "test",
      password: ""
    }}

    requireFields(fields)(req, res, next)

    sinon.assert.calledWith(res.status, 400)
    sinon.assert.calledWith(res.json, sinon.match({missingFields : missingFields}))
  })

  it("should throw an error if no required fields are specified by the server", () => {
    expect(requireFields, "").to.throw()
  })
})
