const express = require("express");
let router = express.Router();
const validateIcnCategory = require("../../middlewares/validateIconCategory");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
var { IconCategory } = require("../../models/iconCategory");
var { Icon } = require("../../models/icon");
//get categories
router.get("/", async (req, res) => {
  // console.log(req.user);
  let categories = await IconCategory.find();
  let total = await IconCategory.countDocuments();
  return res.send({ total, categories });
});
//update a record
router.put("/:id", validateIcnCategory, auth, admin, async (req, res) => {
  let category = await IconCategory.findById(req.params.id);
  category.name = req.body.name;
  category.d = req.body.d;
  category.color = req.body.color;
  category.iconName = req.body.iconName;

  let logo = new Icon().find({ name: req.body.logoName });
  logo.name = req.body.iconNamed;
  logo.category = req.body.name;
  logo.d = req.body.d;
  await logo.save();

  await category.save();
  return res.send("Icon category Updated successfuly");
});
//Delete a record
router.delete("/:id", auth, admin, async (req, res) => {
  let category = await Category.findByIdAndDelete(req.params.id);
  return res.send(category);
});

router.post("/", validateIcnCategory, auth, admin, async (req, res) => {
  let category = await IconCategory();
  category.name = req.body.name;
  category.d = req.body.d;
  category.color = req.body.color;
  category.iconName = req.body.iconName;
  let logo = new Icon();
  logo.name = req.body.iconName;
  logo.category = req.body.name;
  logo.d = req.body.d;
  await logo.save();

  await category.save();
  return res.send("Category  created successfuly");
});
module.exports = router;
