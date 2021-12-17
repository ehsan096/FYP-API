const { validateFrontLogo } = require("../models/logo");
function validateFrontLogos(req, res, next) {
  let { error } = validateFrontLogo(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  next();
}
module.exports = validateFrontLogos;
