var sinon = require('sinon')
var requireLoggedIn = require('./requireLoggedIn')

var sandbox = sinon.createSandbox()
var req = {isAuthenticated: sandbox.stub()}
var res = {sendStatus: sandbox.spy()}
var next = sandbox.spy()

describe('requireLoggedIn middleware', () => {
  afterEach(() => {
    sandbox.reset()
  })

  it('should sendStatus 401 if user is not authenticated', () => {
    req.isAuthenticated.returns(false)

    requireLoggedIn(req, res, next)

    sinon.assert.calledWith(res.sendStatus, 401)
    sinon.assert.notCalled(next)
  })

  it('should call next if user is authenticated', () => {
    req.isAuthenticated.returns(true)

    requireLoggedIn(req, res, next)

    sinon.assert.called(next)
    sinon.assert.notCalled(res.sendStatus)
  })
})
