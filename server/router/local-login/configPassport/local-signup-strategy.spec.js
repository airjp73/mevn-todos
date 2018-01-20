"use strict"

var sinon = require('sinon')
var chai = require('chai')
var chaiPassport = require('chai-passport-strategy')
chai.use(chaiPassport)
var expect = chai.expect

var proxyquire = require('proxyquire')
var mocks = require('../../../testMocks')
var strategy = proxyquire('./local-signup-strategy', {
  '../../../models/user': mocks.UserModel
})

describe("local-signup-strategy", () => {

  beforeEach(() => {
    mocks.reset()
  })

  it("success case", (done) => {

      mocks.UserModel.findOne.returns(null)
      mocks.user.password = undefined
      mocks.user.confirmEmailToken = undefined

      chai.passport.use(strategy)
        .req((req) => {
          req.body = {
            email: "testEmail@gmail.com",
            password: "testPass"
          }
        })
        .success((user, info) => {
          expect(user).to.equal(mocks.user)
          sinon.assert.calledOnce(mocks.user.save)

          expect(mocks.user.confirmEmailToken).to.equal(mocks.vals.token)
          expect(mocks.user.password).to.equal("testPass" + mocks.vals.hashSuffix)
          done()
        })
        .authenticate()
    })

    it("should fail if email taken", (done) => {
      chai.passport.use(strategy)
        .req((req) => {
          req.body = {
            email: mocks.user.email,
            password: "testPass"
          }
        })
        .fail((challenge, status) => {
          done()
        })
        .authenticate()
    })

    it("should return 401 if bad email", (done) => {
      chai.passport.use(strategy)
      .req((req) => {
        req.body = {
          email: "notanemail",
          password: mocks.user.password
        }
      })
      .fail((challenge, status) => {
        done()
      })
      .authenticate()
    })
})
