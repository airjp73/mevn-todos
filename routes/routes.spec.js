var chai = require('chai')
var chaiHttp = require('chai-http')
var should = chai.should()
chai.use(chaiHttp)

var User = require('../models/user.js')
var tests = require('./tests.js')


//Routes
  //login
  //logout
  //signup
  //resendConfirmation
  //confirmEmail
  //changePassword
  //forgotPassword
  //resetPassword

if (process.env.NODE_ENV == 'test') {

  describe('route testing', () => {

    beforeEach((done) => {
      User.collection.drop()
      done()
    })


    it('should return user on /signup POST', tests.signup)
    it('should return user on /login  POST', tests.login)
    //it('should return 200  on /logout POST', tests.logout)
    //it('')
  })

}
