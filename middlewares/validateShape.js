const { validateShape } = require("../models/shape");
function validateShapes(req, res, next) {
  let { error } = validateShape(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  next();
}
module.exports = validateShapes;
