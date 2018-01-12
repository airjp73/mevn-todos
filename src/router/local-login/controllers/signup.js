"use strict"

var email = require('../../../email')

module.exports = async (req, res, next) => {
  try {

    res.sendStatus(200)

    //main operation is successfull so email is sent after status(200)
    email.send({
      template: "confirmEmail",
      message: { to: req.user.email },
      locals: {
        link: "http://" + process.env.HOST + "/confirmEmail?token=" + req.user.confirmEmailToken,
      }
    })
  }
  catch(err) {
    next(err)
  }
}
