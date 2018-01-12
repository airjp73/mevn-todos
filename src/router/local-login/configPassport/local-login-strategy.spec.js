"use strict"

var chai = require('chai')
var chaiPassport = require('chai-passport-strategy')
chai.use(chaiPassport)
var expect = chai.expect

var proxyquire = require('proxyquire')
var mocks = require('../../../testMocks')
var strategy = proxyquire('./local-login-strategy', {
  '../../../models/user': mocks.UserModel
})


describe("local-login-strategy", () => {

  before(() => {
    mocks.reset()
  })

  it("should return user on success", (done) => {
    chai.passport.use(strategy)
      .req((req) => {
        req.body = {
          email: mocks.user.email,
          password: mocks.user.passwordNoHash
        }
      })
      .success((user, info) => {
        expect(user.email).to.equal(mocks.user.email)
        done()
      })
      .authenticate()
  })

  it("should 401 if bad password", (done) => {
    chai.passport.use(strategy)
      .req((req) => {
        req.body = {
          email: mocks.user.email,
          password: "nomatch"
        }
      })
      .fail((challenge, status) => {
        done()
      })
      .authenticate()
  })

  it("should fail if no matching user", (done) => {
    chai.passport.use(strategy)
    .req((req) => {
      req.body = {
        email: "nomatch@email.com",
        password: mocks.user.password
      }
    })
    .fail((challenge, status) => {
      done()
    })
    .authenticate()
  })

})
