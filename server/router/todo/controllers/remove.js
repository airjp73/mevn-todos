"use strict"

module.exports = async (req, res, next) => {
  try {

    //find todo that should be removed
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

    //remove todo
    req.user.todos.splice(index, 1)
    req.user = await req.user.save()
    res.sendStatus(200)

  }
  catch(err) {
    next(err)
  }
}
