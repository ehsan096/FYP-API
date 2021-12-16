const { validate } = require("../models/user");
function validateRegister(req, res, next) {
  console.log("Request > ", req.body);
  let { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  next();
}
module.exports = validateRegister;
