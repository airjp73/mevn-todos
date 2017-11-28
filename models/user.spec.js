var chai = require('chai')
var should = chai.should()
var expect = chai.expect
var sinon = require('sinon')
var User = require('./user.js')
var server = require('../server.js')

const TEST_USER = {
  //_id provided later
  email: "mrTestUser@test.com",
  profileName: "Mr. Test",
  password: "myTestPass",
  resetPasswordToken: "dfdfdfdfdfdfdf",
  resetPasswordExpires: Date.now() + 360000,
  confirmEmailToken: "dfdfdfdfdfdfdfdf",
  emailConfirmed: false
}

const TEST_USER2 = {
  //_id provided later
  email: "mrTestUser2@test.com",
  profileName: "Mr. Test2",
  password: "myTestPass2",
  resetPasswordToken: "dfdfdfdfdfdfdf2",
  resetPasswordExpires: Date.now() + 360000,
  confirmEmailToken: "dfdfdfdfdfdfdfdf2",
  emailConfirmed: false
}

var sandbox = sinon.createSandbox()
var next = sandbox.spy()
var res = {
  sendStatus: sandbox.spy()
}
var req = {
  body: {
    email: TEST_USER.email,
    profileName: "NoMatchName"
  },
  user: {
    //_id: TEST_USER2._id      provided later
  }
}

if (process.env.NODE_ENV = "test") {

  describe("User", () => {
    before(async () => {
      User.collection.drop()

      var user = new User()
      user.email = TEST_USER.email
      user.profileName = TEST_USER.profileName
      user.password = user.generateHash(TEST_USER.password)
      user.confirmEmailToken = TEST_USER.confirmEmailToken
      user.resetPasswordToken = TEST_USER.resetPasswordToken
      user.resetPasswordExpires = TEST_USER.resetPasswordExpires
      user.emailConfirmed = TEST_USER.emailConfirmed
      user = await user.save()
      TEST_USER._id = user._id
    })

    it("removeSensitiveInfo should remove password, confirmEmailToken, \
        resetPasswordToken, and resetPasswordExpires", async () => {

      var user = await User.findOne(
        {email: TEST_USER.email},
        "+password +confirmEmailToken +resetPasswordToken + resetPasswordExpires"
      )

      user.should.have.property("password")
      user.should.have.property("confirmEmailToken")
      user.should.have.property("resetPasswordToken")
      user.should.have.property("resetPasswordExpires")

      user.removeSensitiveInfo()

      expect(user.password).to.be.an('undefined')
      expect(user.confirmEmailToken).to.be.an('undefined')
      expect(user.resetPasswordToken).to.be.an('undefined')
      expect(user.resetPasswordExpires).to.be.an('undefined')
    })

    describe("findUserFromRequest", () => {


      before(async () => {
        //second user used to make sure findUserFromRequest is using correct data
        var user2 = new User()
        user2.email = TEST_USER2.email
        user2.profileName = TEST_USER2.profileName
        user2.password = user2.generateHash(TEST_USER2.password)
        user2.confirmEmailToken = TEST_USER2.confirmEmailToken
        user2.resetPasswordToken = TEST_USER2.resetPasswordToken
        user2.resetPasswordExpires = TEST_USER2.resetPasswordExpires
        user2.emailConfirmed = TEST_USER2.emailConfirmed
        user2 = await user2.save()
        TEST_USER2._id = user2._id
      })

      beforeEach(() => {
        req.user = {
          _id: TEST_USER2._id
        }
      })

      afterEach(() => {
        sandbox.resetHistory()
      })

      it("use specified field in req.body to query user", async () => {

        await User.findUserFromRequest("email")(req, res, next)

        sinon.assert.calledWithExactly(next) //next with no err
        sinon.assert.notCalled(res.sendStatus)
        expect(req.user._id.toString()).to.equal(TEST_USER._id.toString())
      })

      it("select user data using specified projection string", async () => {
        await User.findUserFromRequest("email", "+confirmEmailToken")(req, res, next)

        sinon.assert.calledWithExactly(next) //next with no err
        sinon.assert.notCalled(res.sendStatus)
        expect(req.user._id.toString()).to.equal(TEST_USER._id.toString())
        expect(req.user.confirmEmailToken).to.equal(TEST_USER.confirmEmailToken)
      })

      it("use req.user._id for query when no field specified", async () => {

        await User.findUserFromRequest()(req, res, next)

        sinon.assert.calledWithExactly(next) //next with no err
        sinon.assert.notCalled(res.sendStatus)
        expect(req.user._id.toString()).to.equal(TEST_USER2._id.toString())
      })

      it("call next(err) if no field or req.user provided", async () => {
        var reqNoInfo = {}

        await User.findUserFromRequest()(reqNoInfo, res, next)

        sinon.assert.calledWith(next, sinon.match.instanceOf(Error))
        sinon.assert.notCalled(res.sendStatus)
      })

      it("send 404 if no matching user is found", async () => {
        await User.findUserFromRequest("profileName")(req, res, next)

        sinon.assert.calledWith(res.sendStatus, 404)
        sinon.assert.notCalled(next)
      })

      it("send 404 if field specified is not in req.body request", async () => {
        await User.findUserFromRequest("hullaballoo")(req, res, next)

        sinon.assert.calledWith(res.sendStatus, 404)
        sinon.assert.notCalled(next)
      })
    })
  })
}
