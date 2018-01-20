var chai = require('chai')
var expect = chai.expect
var controllers = require('./index.js')

describe("controllers", () => {
  expect(controllers).to.be.an('object')
})
