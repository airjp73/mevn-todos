"use strict"

module.exports = (req, res) => {
  req.logout()
  res.sendStatus(200)
}
