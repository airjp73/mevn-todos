var sinon = require('sinon')
var handleErrors = require("./handleErrors.js")

var sandbox = sinon.createSandbox()
var next = sandbox.spy()
var req = {}
var err = "Hi"
//var log = sandbox.stub(console, "log")

describe("handleErrors middleware", () => {
  afterEach(() => {
    sandbox.resetHistory()
  })

  after(() => {
    sandbox.restore()
  })

  it("should log and send status 500 if no headers have been sent", () => {
    var res = {
      sendStatus: sandbox.spy(),
      headerSent: false
    }

    handleErrors(err, req, res, next)

    sinon.assert.calledWith(res.sendStatus, 500)
    //sinon.assert.called(log)
  })

  it("should log and no status if headers have been sent", () => {
    var res = {
      sendStatus: sandbox.spy(),
      headerSent: true
    }

    handleErrors(err, req, res, next)

    sinon.assert.notCalled(res.sendStatus)
    //sinon.assert.called(log)
  })
})
