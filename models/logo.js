var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
var logoSchema = mongoose.Schema({
  name: String,
  category: String,
  logotype: {
    type: String,
    default: "normal",
  },
  logoSvg: String,
  logoJson: String,
});
var Logo = mongoose.model("Logo", logoSchema);

function validateLogo(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    category: Joi.string().min(3).max(100).required(),
    logoSvg: Joi.string().min(10).required(),
    logoJson: Joi.string().min(10),
  });
  return schema.validate(data, { abortEarly: false });
}
module.exports.Logo = Logo;
module.exports.validate = validateLogo;
