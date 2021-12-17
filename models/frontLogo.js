var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
var frontLogoSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  category: {
    type: String,
    unique: true,
  },
  logotype: {
    type: String,
    default: "normal",
  },
  logoSvg: String,
  logoJson: String,
});
var FrontLogo = mongoose.model("FrontLogo", frontLogoSchema);

function validateFrontLogo(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    category: Joi.string().min(3).max(100).required(),
    logoSvg: Joi.string().min(10).required(),
    logoJson: Joi.string().min(10),
  });
  return schema.validate(data, { abortEarly: false });
}
module.exports.FrontLogo = FrontLogo;
module.exports.validateFrontLogo = validateFrontLogo;
