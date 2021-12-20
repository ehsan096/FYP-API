var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const { join } = require("lodash");
var iconCategorySchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  d: String,
  color: String,
  iconName: String,
});
var IconCategory = mongoose.model("IconCategory", iconCategorySchema);

function validateIconCategory(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    d: Joi.string().min(3).required(),
    color: Joi.string().min(3).max(10),
    iconName: Joi.string().min(3).max(100).required(),
  });
  return schema.validate(data, { abortEarly: false });
}
module.exports.IconCategory = IconCategory;
module.exports.validateIconCategory = validateIconCategory;
