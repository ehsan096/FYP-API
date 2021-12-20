var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
var iconSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  category: String,
  d: String,
});
var Icon = mongoose.model("Icon", iconSchema);

function validateIcon(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    category: Joi.string().min(3).max(100).required(),
    d: Joi.string().min(3).required(),
  });
  return schema.validate(data, { abortEarly: false });
}
module.exports.Icon = Icon;
module.exports.validateIcon = validateIcon;
