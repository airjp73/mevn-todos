"use strict"

var email = require('../../../email')
var User = require('../../../models/user')

module.exports = async (req, res, next) => {
  try {

    var selection = { confirmEmailToken: req.params.confirmEmailToken }
    var projection = "+confirmEmailToken"
    var user = await User.findOne(selection, projection)

    if (!user) {
      req.flash('info', 'No user found with that token')
      return res.redirect('/')
    }

    user.emailConfirmed = true
    user.confirmEmailToken = undefined
    user = await user.save()

    req.flash('info', 'Email successfully confirmed!')
    res.redirect('/')

    //main operation is successfull so email is sent after status(200)
    email.send({
      template: "welcome",
      message: { to: user.email  }
    })
  }
  catch(err) {
    next(err)
  }
}
