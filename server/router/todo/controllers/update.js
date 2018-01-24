"use strict"

var User = require('../../../models/user.js')

module.exports = async (req, res, next) => {
  try {

    //find todo that should be updated
    var index = req.user.todos.findIndex((todo) => {
      for (var field in req.body.todo) {
        if (!todo.hasOwnProperty(field) || todo[field] !== req.body.todo[field])
          return false
      }
      return true
    })

    //if no match found
    if (index === -1)
      return res.sendStatus(404).json({message:"Todo not found"})

    //update todo
    Object.assign(req.user.todos[index], req.body.changes)
    req.user.markModified('todos')
    req.user = await req.user.save()

    res.sendStatus(200)
  }
  catch(err) {
    next(err)
  }
}
