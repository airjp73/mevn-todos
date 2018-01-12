var sinon = require('sinon')
var handleErrors = require("./handleErrors.js")

var sandbox = sinon.createSandbox()
var next = sandbox.spy()
var req = {}
var err = "Hi"


describe("handleErrors middleware", () => {

  it("should log and send status 500 if no headers have been sent", () => {
    var log = sandbox.stub(console, "log")
    var res = {
      sendStatus: sandbox.spy(),
      headerSent: false
    }

    handleErrors(err, req, res, next)

    sinon.assert.calledWith(res.sendStatus, 500)
    sinon.assert.called(log)
    log.restore()
  })

  it("should log and no status if headers have been sent", () => {
    var log = sandbox.stub(console, "log")
    var res = {
      sendStatus: sandbox.spy(),
      headerSent: true
    }

    handleErrors(err, req, res, next)

    sinon.assert.notCalled(res.sendStatus)
    sinon.assert.called(log)
    log.restore()
  })
})
