const { validateIconCategory } = require("../models/iconCategory");
function validateIcnCategory(req, res, next) {
  let { error } = validateIconCategory(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  next();
}
module.exports = validateIcnCategory;
