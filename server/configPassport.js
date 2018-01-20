var passport = require('passport')
var User = require("./models/user")

//Serialization
module.exports = function() {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      var user = await User.findById(id)
      done(null, user)
    }
    catch(err) {
      done(err)
    }
  })
}
