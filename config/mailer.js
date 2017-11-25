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

async function sendEmail(template, target, vars) {
  var info = await email.send({
    template: "emails/" + template,
    message: {
      to: target
    },
    locals: vars
  })
  console.log("Message sent: %s", info.messageId)

  return info
}

var mailer = {
  transporter,
  email,
  sendEmail
}

module.exports = mailer
