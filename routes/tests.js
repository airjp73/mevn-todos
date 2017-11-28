var chai = require('chai')
var server = require('../server.js')
var User = require('../models/user.js')

const TEST_USER = {
  email: "mrTestUser@test.com",
  profileName: "Mr. Test",
  password: "myTestPass",
  newPassword: "myNewTestPass"
}

var mockUser = async () => {
  var testUser = new User()
  testUser.email = TEST_USER.email
  testUser.profileName = TEST_USER.profileName
  testUser.password = testUser.generateHash(TEST_USER.password)
  return await testUser.save()
}

module.exports = {
  signup(done) {
    chai.request(server)
      .post('/api/signup')
      .send({
        email: TEST_USER.email,
        profileName: TEST_USER.profileName,
        password: TEST_USER.password
      })
      .end((err, res) => {
        res.should.have.status(200)
        res.should.be.json
        res.body.email.should.equal(TEST_USER.email)
        res.body.profileName.should.equal(TEST_USER.profileName)
        res.body.should.not.have.property('password')
        res.body.should.not.have.property('confirmEmailToken')
        res.body.should.not.have.property('resetPasswordToken')
        res.body.should.not.have.property('resetPasswordExpires')
        done()
      })
  },

  login(done) {
    mockUser()
    chai.request(server)
      .post('/api/login')
      .send({
        email: TEST_USER.email,
        password: TEST_USER.password
      })
      .end((err, res) => {
        res.should.have.status(200)
        res.should.be.json
        res.body.email.should.equal(TEST_USER.email)
        res.body.profileName.should.equal(TEST_USER.profileName)
        res.body.should.not.have.property('password')
        res.body.should.not.have.property('confirmEmailToken')
        res.body.should.not.have.property('resetPasswordToken')
        res.body.should.not.have.property('resetPasswordExpires')
        done()
      })
  }
}
