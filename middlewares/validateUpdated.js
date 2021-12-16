const { validateUpdate } = require("../models/user");
function validateUpdated(req, res, next) {
  let { error } = validateUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  next();
}
module.exports = validateUpdated;
