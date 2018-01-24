"use strict"

module.exports = async (req, res, next) => {
  try {
    req.user.todos.push(req.body.todo)
    req.user = await req.user.save()
    res.sendStatus(200)
  }
  catch(err) {
    next(err)
  }
}
