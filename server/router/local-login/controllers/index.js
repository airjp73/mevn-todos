var crypto = require("crypto")

module.exports = {
  signup: require('./signup'),
  login:  require('./login'),
  logout: require('./logout'),

  resendConfirmation: require('./resendConfirmation'),
  confirmEmail: require('./confirmEmail'),
  changePassword: require('./changePassword'),
  forgotPassword: require('./forgotPassword'),
  resetPassword: require('./resetPassword')
}
