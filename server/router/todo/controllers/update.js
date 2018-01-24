"use strict"

module.exports = async (req, res, next) => {
  try {
    var newTodo = req.body.todo
    var changes = req.body.changes
    var index = req.user.todos.findIndex((todo) => {
      return todo.text === newTodo.text
    })
    Object.assign(req.user.todos[index], changes)
    await req.user.save()
    res.sendStatus(200)
  }
  catch(err) {
    next(err)
  }
}
