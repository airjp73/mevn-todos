var mailer = require("../config/mailer.js")
var crypto = require("crypto")

module.exports = {
  ////login
  login(req, res, next) {
    req.user.removeSensitiveInfo()
    return res.status(200).json(req.user)
  },



  ////signup
  signup(req, res, next) {
    mailer.sendEmail("emailConfirm", req.user.email, {
        name: req.user.profileName,
        link: "http://" + req.headers.host + "/emailConfirm/" + req.user.confirmEmailToken,
      })
      .catch(next)

    req.user.removeSensitiveInfo()
    res.status(200).json(req.user)
  },



  ////resendConfirmation
  async resendConfirmation(req, res, next) {
    if (req.user.emailConfirmed)
      return res.status(403).json({message:"Email already confirmed"})

    mailer.sendEmail("emailConfirm", req.user.email, {
        name: req.user.profileName,
        link: "http://" + req.headers.host + "/emailConfirm/" + req.user.confirmEmailToken,
      })
      .catch(next)

    res.sendStatus(202)
  },



  ////confirmEmail
  async confirmEmail(req, res, next) {
    try {

      req.user.emailConfirmed = true
      req.user.confirmEmailToken = undefined
      req.user = await req.user.save()

      res.sendStatus(200)

      mailer.sendEmail("emailConfirmThankYou", req.user.email, {
          name: req.user.profileName
        })

    }
    catch(err) {
      next(err)
    }
  },



  ////logout
  logout(req, res, next) {
    req.logout()
    return res.status(200).json({message: "Logout Successfull"})
  },



  ////changePassword
  async changePassword(req, res, next) {
    try {

      req.user.password = req.user.generateHash(req.body.newPassword)
      req.user = await req.user.save()

      res.sendStatus(200)

      mailer.sendEmail("passwordChanged", req.user.email, {
          name: req.user.profileName
        })

    }
    catch(err) {
      next(err)
    }
  },



  ////forgotPassword
  async forgotPassword(req, res, next) {
    try {

      req.user.resetPasswordToken = crypto.randomBytes(32).toString('hex')
      req.user.resetPasswordExpires = Date.now() + 3600000 //1 hour
      req.user = await req.user.save()

      res.sendStatus(200)

      mailer.sendEmail("forgotPassword", req.user.email, {
          name: req.user.profileName,
          link: "http://" + req.headers.host + "/reset/" + req.user.resetPasswordToken
        })

    }
    catch(err) {
      next(err)
    }
  },



  ////resetPassword
  async resetPassword(req, res, next) {
    try {

      if (Date.now() > req.user.resetPasswordExpires) {
        res.status(403).json({message:"Reset password token expired"})
        req.user.resetPasswordToken = undefined
        req.user.resetPasswordExpires = undefined
        await req.user.save()
        return
      }

      req.user.password = req.user.generateHash(req.body.newPassword)
      req.user.resetPasswordToken = undefined
      req.user.resetPasswordExpires = undefined
      req.user = await req.user.save()

      res.sendStatus(200)

      mailer.sendEmail("passwordChanged", req.user.email, {
          name: req.user.profileName
        })

    }
    catch(err) {
      next(err)
    }
  }
}
