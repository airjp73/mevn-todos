module.exports = function(error, req, res, next) {
  console.log(err)

  if (!res.headerSent)
    res.sendStatus(500)
}
