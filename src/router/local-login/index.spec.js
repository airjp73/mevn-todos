"use strict"

var chai = require('chai')
var expect = chai.expect

var express = require('express')
var router = require('./index.js')

describe("router", () => {
  it("should export an express router", () => {
    expect(Object.getPrototypeOf(router)).to.equal(express.Router)
  })
})
