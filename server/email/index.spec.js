var chai = require('chai')
var expect = chai.expect
var Email = require('email-templates')
var mailer = require('./index.js')


describe("mailer", () => {
  it("should export an Email object", () => {
    expect(mailer).to.be.instanceOf(Email)
  })
})
