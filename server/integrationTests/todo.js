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

const TEST_USER = {
  email: "mrTestUser@test.com",
  profileName: "Mr. Test",
  password: "myTestPass",
  newPassword: "myNewTestPass",
  confirmEmailToken: "testtest"
}
var mockUser = async (todos = []) => {
  var testUser = new User()
  testUser.email = TEST_USER.email
  testUser.password = bcrypt.hashSync(TEST_USER.password, bcrypt.genSaltSync(8), null)
  testUser.confirmEmailToken = TEST_USER.confirmEmailToken
  testUser.emailConfirmed = false
  testUser.todos = todos
  return await testUser.save()
}



describe('todo', () => {
  beforeEach(async () => {
    await User.collection.remove({email: TEST_USER.email})
    agent = chai.request.agent(server)
  })

  describe('add', () => {
    it("should add todo", async () => {
      var user = await mockUser()
      var fields = {
        email: TEST_USER.email,
        password: TEST_USER.password,
        todo: {text: "Hello"}
      }

      await agent.post("/api/login").send(fields)
      var res = await agent.post("/api/todo/add").send(fields)
      expect(res).to.have.status(200)

      user = await User.findOne({email: TEST_USER.email})
      expect(user.todos.length).to.equal(1)
      expect(user.todos[0].text).to.equal("Hello")
    })
  })


  describe('remove', () => {
    it("should remove todo", async () => {
      var user = await mockUser([
        {text:"hi"},
        {text:"hello", field1: "goodbye"},
        {fish:"blue", other: "something", field1: "goodbye"}
      ])
      var fields = {
        email: TEST_USER.email,
        password: TEST_USER.password,
        todo: {field1: "goodbye", fish: "blue"}
      }

      await agent.post("/api/login").send(fields)
      var res = await agent.post("/api/todo/remove").send(fields)
      expect(res).to.have.status(200)

      user = await User.findOne({email: TEST_USER.email})
      expect(user.todos.length).to.equal(2)
      expect(user.todos[0].text).to.equal("hi")
      expect(user.todos[1].text).to.equal("hello")
    })
  })

  describe('update', () => {
    it("should update a todo", async () => {
      var user = await mockUser([
        {text:"hi"},
        {text:"hello", field1: "goodbye"},
        {fish:"blue", other: "something", field1: "goodbye"}
      ])
      var fields = {
        email: TEST_USER.email,
        password: TEST_USER.password,
        todo: {field1: "goodbye", fish: "blue"},
        changes: {field1: "balooga", newField: "george"}
      }

      await agent.post("/api/login").send(fields)
      var res = await agent.post("/api/todo/update").send(fields)
      expect(res).to.have.status(200)

      user = await User.findOne({email: TEST_USER.email})
      expect(user.todos.length).to.equal(3)
      expect(user.todos[2].fish).to.equal("blue")
      expect(user.todos[2].other).to.equal("something")
      expect(user.todos[2].field1).to.equal("balooga")
      expect(user.todos[2].newField).to.equal("george")
    })
  })

})//end describe
