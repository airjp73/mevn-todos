"use strict"

var email = require('../../../email')
var User = require('../../../models/user')

module.exports = async (req, res, next) => {
  try {
    var user = await User.findOne({resetPasswordToken: req.body.resetPasswordToken}, "+resetPasswordToken +resetPasswordExpires")

    if (!user)
      return res.status(404).json({message: "No user with that resetPasswordToken"})

    if (Date.now() > user.resetPasswordExpires) {
      res.status(403).json({message:"Reset password token expired"})
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save()
      return
    }

    user.setPassword(req.body.newPassword)
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    user = await user.save()

    res.sendStatus(200)

    email.send({
      template: "passwordChanged",
      message: { to: user.email }
    })
  }
  catch(err) {
    next(err)
  }
}
