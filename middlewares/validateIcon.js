const { validateIcon } = require("../models/icon");
function validateIcons(req, res, next) {
  let { error } = validateIcon(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  next();
}
module.exports = validateIcons;
