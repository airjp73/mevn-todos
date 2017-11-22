var nodemailer = require('nodemailer')
var Email = require('email-templates')


var transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASS
  }
})

var email = new Email({
  views: {
    root: __dirname
  },
  message: {
    from: "AaronP <aaron@bob.com>"
  },
  transport: transporter
})

var mailer = {
  transporter,
  email,
  sendEmail(template, target, vars) {
    return email.send({
      template: "emails/" + template,
      message: {
        to: target
      },
      locals: vars
    })
  }
}

module.exports = mailer
