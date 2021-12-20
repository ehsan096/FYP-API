var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
var shapeSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  d: String,
});
var Shape = mongoose.model("Shape", shapeSchema);

function validateShape(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    d: Joi.string().min(3).required(),
  });
  return schema.validate(data, { abortEarly: false });
}
module.exports.Shape = Shape;
module.exports.validateShape = validateShape;
