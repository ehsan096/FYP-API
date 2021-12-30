var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
var categorySchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  bannerTitle: String,
  logoTitle: String,
  paragraph: String,
  svgString: String,
  logoName: String,
  logoSvg: String,
  logoJson: String,
});
var Category = mongoose.model("Category", categorySchema);

function validateCategory(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    bannerTitle: Joi.string().min(3).required(),
    logoTitle: Joi.string().min(3).required(),
    paragraph: Joi.string().min(3).required(),
    svgString: Joi.string().min(3).required(),
    logoName: Joi.string().min(3).required(),
    logoSvg: Joi.string().min(3).required(),
    logoJson: Joi.string().allow("").optional(),
  });
  return schema.validate(data, { abortEarly: false });
}
module.exports.Category = Category;
module.exports.validate = validateCategory;
