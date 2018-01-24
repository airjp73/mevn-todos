"use strict"

var chai = require('chai')
var chaiHttp = require('chai-http')
chai.use(chaiHttp)
var expect = chai.expect
var sinon = require('sinon')

var bcrypt = require('bcrypt-nodejs')

var User   = require('../models/user.js')
var server = require('../index.js')
var agent = {}

const COOKIE = "connect.sid"
const TEST_USER = {
  email: "mrTestUser@test.com",
  profileName: "Mr. Test",
  password: "myTestPass",
  newPassword: "myNewTestPass",
  confirmEmailToken: "testtest"
}
var mockUser = async () => {
  var testUser = new User()
  testUser.email = TEST_USER.email
  testUser.password = bcrypt.hashSync(TEST_USER.password, bcrypt.genSaltSync(8), null)
  testUser.confirmEmailToken = TEST_USER.confirmEmailToken
  testUser.emailConfirmed = false
  return await testUser.save()
}

var mail = require('../email')
var mailStub = sinon.stub(mail, "send")


describe('local-login', () => {
  beforeEach(async () => {
    mailStub.reset()
    await User.collection.remove({email: TEST_USER.email})
    agent = chai.request.agent(server)
  })

  ////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////Login
  ////////////////////////////////////////////////////////////////////////////
  describe('login', () => {
    it("should return 200 and session cookie if successfull login", async () => {
      var user = await mockUser()
      var fields = {
        email: TEST_USER.email,
        password: TEST_USER.password
      }

      var res = await agent.post("/api/login").send(fields)
      expect(res).to.have.status(200)
      expect(res).to.have.cookie(COOKIE)
    })

    it("should return 401 if failed login", async () => {
      var fields = {
        email: "nomatch@nomatch.com",
        password: "nomatchpass"
      }

      var res = await agent.post("/api/login").send(fields)
      expect(res).to.have.status(401)
    })
  })

  ////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////Logout
  ////////////////////////////////////////////////////////////////////////////
  describe('logout', () => {
    it("should return 401 if not logged in", async () => {
      var res = await agent.post("/api/logout")
      expect(res).to.have.status(401)
    })

    it("should return 200 and no cookie on successfull logout", async () => {
      var user = await mockUser()
      var fields = {
        email: TEST_USER.email,
        password: TEST_USER.password
      }

      var res = await agent.post("/api/login").send(fields)
      res = await agent.post("/api/logout")
      expect(res).to.have.status(200)
      expect(res).to.not.have.cookie(COOKIE)
    })
  })

  ////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////Signup
  ////////////////////////////////////////////////////////////////////////////
  describe('signup', () => {
    it("should return 200 and save user to database", async () => {
      var res = await agent.post("/api/signup").send({
        email: TEST_USER.email,
        password: TEST_USER.password
      })
      expect(res).to.have.status(200)

      var user = await User.findOne({email: TEST_USER.email})
      expect(user).to.exist

    })

    it("should return 401 if user already exists", async () => {
      var user = await mockUser()
      var fields = {
        email: TEST_USER.email,
        password: TEST_USER.password
      }

      var res = await agent.post("/api/signup").send(fields)
      expect(res).to.have.status(401)
    })

    it("should return 400 if email or password not provided", async () => {
      var fields = {
        email: TEST_USER.email
      }

      var res = await agent.post("/api/signup").send(fields)
      expect(res).to.have.status(400)
    })
  })

  ////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////ResendConfirmation
  ////////////////////////////////////////////////////////////////////////////
  describe("resendConfirmation", () => {
    it("should send an email with confirmation token", async () => {
      await mockUser()
      var fields = {
        email: TEST_USER.email,
        password: TEST_USER.password
      }
      var url = "http://" + process.env.HOST + "/confirmEmail?token=" + TEST_USER.confirmEmailToken

      await agent.post("/api/login").send(fields)
      await agent.post("/api/resendConfirmation")

      sinon.assert.calledOnce(mailStub)
      var options = mailStub.getCall(0).args[0]
      expect(options.template).to.equal("confirmEmail")
      expect(options.message.to).to.equal(TEST_USER.email)
      expect(options.locals.link).to.equal(url)
    })

    it("should return 403 if already confirmed", async () => {
      var user = await mockUser()
      user.emailConfirmed = true
      await user.save()

      var fields = {
        email: TEST_USER.email,
        password: TEST_USER.password
      }
      await agent.post("/api/login").send(fields)

      var res = await agent.post("/api/resendConfirmation")
      expect(res).to.have.status(403)
    })

    it("should return 401 if not logged in", async () => {
      var res = await agent.post("/api/resendConfirmation")
      expect(res).to.have.status(401)
    })
  })


  ////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////ConfirmEmail
  ////////////////////////////////////////////////////////////////////////////
  describe("confirmEmail", () => {
    it("should set emailConfirmed to true and delete token", async () => {
      await mockUser()
      var fields = {
        confirmEmailToken: TEST_USER.confirmEmailToken
      }

      await agent.post("/api/confirmEmail").send(fields)

      var user = await User.findOne({email: TEST_USER.email}, "emailConfirmed confirmEmailToken")
      expect(user.emailConfirmed).to.be.true
      expect(user.confirmEmailToken).to.be.undefined

      sinon.assert.calledOnce(mailStub)
      var options = mailStub.getCall(0).args[0]
      expect(options.template).to.equal("welcome")
      expect(options.message.to).to.equal(TEST_USER.email)
    })

    it("should return 404 if confirmEmailToken has no match", async () => {
      var fields = {
        confirmEmailToken: "asdfasdf"
      }

      var res = await agent.post("/api/confirmEmail").send(fields)
      expect(res).to.have.status(404)
      sinon.assert.notCalled(mailStub)
    })
  })

  ////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////ChangePassword
  ////////////////////////////////////////////////////////////////////////////
  describe("changePassword", () => {
    it("should change users password", async () => {
      await mockUser()
      var fields = {
        email: TEST_USER.email,
        password: TEST_USER.password,
        newPassword: TEST_USER.newPassword
      }

      await agent.post("/api/login").send(fields)
      var res = await agent.post("/api/changePassword").send(fields)

      expect(res).to.have.status(200)

      var user = await User.findOne({email:TEST_USER.email}, "email password")
      var passChanged = bcrypt.compareSync(TEST_USER.newPassword, user.password)
      expect(passChanged).to.be.true

      sinon.assert.calledOnce(mailStub)
      var options = mailStub.getCall(0).args[0]
      expect(options.template).to.equal("passwordChanged")
      expect(options.message.to).to.equal(TEST_USER.email)
    })

    it("should return 401 on invalid user info", async () => {
      await mockUser()
      var fields = {
        email: TEST_USER.email,
        password: TEST_USER.password,
        newPassword: TEST_USER.newPassword
      }

      await agent.post("/api/login").send(fields)
      fields.password = "nomatch"

      var res = await agent.post("/api/changePassword").send(fields)
      expect(res).to.have.status(401)
      sinon.assert.notCalled(mailStub)
    })

    it("should return 400 on incomplete info", async () => {
      await mockUser()
      var fields = {
        email: TEST_USER.email,
        password: TEST_USER.password,
        newPassword: TEST_USER.newPassword
      }

      await agent.post("/api/login").send(fields)
      delete fields.password

      var res = await agent.post("/api/changePassword").send(fields)
      expect(res).to.have.status(400)
      sinon.assert.notCalled(mailStub)
    })
  })

  ////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////forgotPassword
  ////////////////////////////////////////////////////////////////////////////
  describe("forgotPassword", () => {
    it("should set resetPasswordToken and resetPasswordTokenExpires and send email with link", async () => {
      await mockUser()
      var fields = {
        email: TEST_USER.email
      }

      var res = await agent.post("/api/forgotPassword").send(fields)
      expect(res).to.have.status(202)

      var user = await User.findOne({email:TEST_USER.email}, "resetPasswordToken resetPasswordExpires")
      expect(user.resetPasswordToken).to.exist
      expect(user.resetPasswordExpires).to.exist

      var url = "http://" + process.env.HOST + "/resetPassword?token=" + user.resetPasswordToken
      sinon.assert.calledOnce(mailStub)
      var options = mailStub.getCall(0).args[0]
      expect(options.template).to.equal("forgotPassword")
      expect(options.message.to).to.equal(TEST_USER.email)
      expect(options.locals.link).to.equal(url)
    })

    it("should return 404 if no user with that email", async () => {
      var fields = {
        email: "nomatch@nomatch.com"
      }

      var res = await agent.post("/api/forgotPassword").send(fields)
      expect(res).to.have.status(404)
      sinon.assert.notCalled(mailStub)
    })
  })

  ////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////resetPassword
  ////////////////////////////////////////////////////////////////////////////
  describe("resetPassword", () => {
    it("should change password to newPassword field and send an email", async () => {
      var token = "testToken"

      var user = await mockUser()
      user.resetPasswordToken = token
      user.resetPasswordExpires = Date.now() + 360000
      await user.save()

      var fields = {
        resetPasswordToken: token,
        newPassword: TEST_USER.newPassword
      }
      var res = await agent.post("/api/resetPassword").send(fields)
      expect(res).to.have.status(200)

      user = await User.findOne({_id: user.id}, "password")
      expect(bcrypt.compareSync(TEST_USER.newPassword, user.password)).to.be.true
      sinon.assert.calledOnce(mailStub)
      var options = mailStub.getCall(0).args[0]
      expect(options.template).to.equal("passwordChanged")
      expect(options.message.to).to.equal(TEST_USER.email)
    })

    it("should return 403 if token expired", async () => {
      var token = "testToken"

      var user = await mockUser()
      user.resetPasswordToken = token
      user.resetPasswordExpires = Date.now() - 1
      await user.save()

      var fields = {
        resetPasswordToken: token,
        newPassword: TEST_USER.newPassword
      }
      var res = await agent.post("/api/resetPassword").send(fields)
      expect(res).to.have.status(403)

      user = await User.findOne({_id: user.id}, "password")
      expect(bcrypt.compareSync(TEST_USER.password, user.password)).to.be.true
      sinon.assert.notCalled(mailStub)
    })

    it("should return 404 if no matching user", async () => {
      var fields = {
        resetPasswordToken: "nomatch",
        newPassword: TEST_USER.newPassword
      }

      var res = await agent.post("/api/resetPassword").send(fields)
      expect(res).to.have.status(404)
      sinon.assert.notCalled(mailStub)
    })
  })
})//end describe
