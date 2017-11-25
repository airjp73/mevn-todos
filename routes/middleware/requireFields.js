module.exports = function(fields) {
  return (req, res, next) => {
    var missingFields = []

    for (var i = 0; i < fields.length; ++i) {
      if (!req.body[fields[i]]) {
        missingFields.push(fields[i])
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({message: "Missing required fields", missingFields})
    }

    next()
  }
}
