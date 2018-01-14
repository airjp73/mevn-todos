"use strict"

var email = require('../../../email')
var User = require('../../../models/user')

module.exports = async (req, res, next) => {
  try {

    var user = await User.findOne({_id: req.user.id}, "email password")

    if (!user)
      return res.status(404).json({ message: "User not found" })
    if (!user.validPassword(req.body.password))
      return res.status(401).json({ message: "Invalid Password" })
    user.setPassword(req.body.newPassword)
    await user.save()

    res.status(200).json({ message: "Password Changed" })

    //main operation is successfull so email is sent after status(200)
    email.send({
      template: "passwordChanged",
      message: { to: user.email }
    })
  }
  catch(err) {
    next(err)
  }
}
