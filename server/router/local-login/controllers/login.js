"use strict"

module.exports = (req, res) => {
  res.status(200).json( req.user.toJSON() )
}
