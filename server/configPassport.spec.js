"use strict"

var chai = require('chai')
var expect = chai.expect

var configPassport = require('./configPassport.js')

describe("configPassport", () => {
  it("should export a function", () => {
    expect(configPassport).to.be.a('function')
  })
})
