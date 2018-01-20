var sinon = require('sinon')
var chai = require('chai')
var expect = chai.expect

////Mocks
var sandbox = sinon.createSandbox()
var authenticateMiddleware = sandbox.spy()
var passportMock = {
  authenticate: sandbox.stub()
}
passportMock.authenticate.returns(authenticateMiddleware)
var req = {
  login: sandbox.spy()
}
var next = sandbox.spy()
var res = {
  status: sandbox.stub(),
  json: sandbox.spy()
}
res.status.returns(res)

////proxyquire
var proxyquire = require('proxyquire')
var authenticate = proxyquire('./authenticate.js', {
  'passport': passportMock
})

//vars for tests
var middleware = undefined
var callback = undefined

describe("authenticate middleware", () => {
  it("should export a function", () => {
    expect(authenticate).to.be.a('function')
  })

  it("function should return a middleware function", () => {
    var strategy = "hi"
    middleware = authenticate(strategy)

    expect(middleware).to.be.a('function')
  })

  it("middleware should call passport.authenticate", () => {
    middleware(req, res, next)

    sinon.assert.called(passportMock.authenticate)
    callback = passportMock.authenticate.getCall(0).args[1]
    sinon.assert.called(authenticateMiddleware)
  })

  describe("callback", () => {
    beforeEach(() => {
      sandbox.resetHistory()
    })

    it("should call req.login if no problems", () => {
      callback(null, {})

      sinon.assert.called(req.login)
      expect( next.getCall(0) ).to.not.exist
    })

    it("should call next if error", () => {
      var err = "error"
      callback(err)

      sinon.assert.notCalled(req.login)
      sinon.assert.called(next)
      expect( next.getCall(0).args[0] ).to.equal(err)
    })

    it("should send status 401 + info if no error and no user", () => {
      var info = {message: "hi"}
      callback(null, false, info)

      sinon.assert.notCalled(req.login)
      sinon.assert.called(res.status)
      sinon.assert.called(res.json)
      expect( res.status.getCall(0).args[0] ).to.equal(401)
      expect( res.json.getCall(0).args[0] ).to.equal(info)
    })
  })
})
