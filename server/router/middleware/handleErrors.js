module.exports = function(err, req, res, next) {
  console.log(err)

  if (!res.headerSent)
    res.sendStatus(500)
}
