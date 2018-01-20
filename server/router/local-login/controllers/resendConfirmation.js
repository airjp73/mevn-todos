"use strict"

var email = require('../../../email')
var User = require('../../../models/user')

module.exports = async (req, res, next) => {
  try {
    var selection = {_id: req.user.id}
    var projection = "+confirmEmailToken"
    var user = await User.findOne(selection, projection)

    if (!user)
      return res.status(404).json({message: "No user found for provided confirmEmailToken"})
    if (user.emailConfirmed)
      return res.status(403).json({message: "Email already confirmed"})

    //should send 202:accepted
    //so response doesn't have to wait for the email
    res.status(202).json({message: "Sending Email"})

    email.send({
      template: "confirmEmail",
      message: { to: user.email },
      locals: {
        link: "http://" + process.env.HOST + "/confirmEmail?token=" + user.confirmEmailToken,
      }
    })
  }
  catch (err) {
    next(err)
  }
}
