"use strict"

var crypto = require('crypto')
var email = require('../../../email')
var User = require('../../../models/user')

module.exports = async (req, res, next) => {
  try {
    var user = await User.findOne({email: req.body.email})
    if (!user)
      return res.status(404).json({message: "no user with that email"})
    user.genResetPasswordToken()
    await user.save()

    //should send 202:accepted
    //so response doesn't have to wait for the email
    res.sendStatus(202)

    email.send({
      template: "forgotPassword",
      message: { to: user.email },
      locals: {
        link: "http://" + process.env.HOST + "/resetPassword?token=" + user.resetPasswordToken
      }
    })
  }
  catch(err) {
    next(err)
  }
}
