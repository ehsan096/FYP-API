const express = require("express");
let router = express.Router();
const validateCategory = require("../../middlewares/validateCategory");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
var { Category } = require("../../models/category");
var { Logo } = require("../../models/logo");
//get categories
router.get("/", async (req, res) => {
  // console.log(req.user);
  let categories = await Category.find();
  let total = await Category.countDocuments();
  return res.send({ total, categories });
});
//update a record
router.put("/:id", validateCategory, auth, admin, async (req, res) => {
  let category = await Category.findById(req.params.id);
  category.name = req.body.name;
  category.bannerTitle = req.body.bannerTitle;
  category.logoTitle = req.body.logoTitle;
  category.paragraph = req.body.paragraph;
  category.logoName = req.body.logoName;
  category.logoSvg = req.body.logoSvg;
  category.logoJson = req.body.logoJson;
  let logo = new Logo().find({ name: req.body.logoName });
  logo.name = req.body.logoName;
  logo.category = req.body.name;
  logo.logoSvg = req.body.logoSvg;
  logo.logoJson = req.body.logoJson;
  await logo.save();

  await category.save();
  return res.send(category);
});
//Delete a record
router.delete("/:id", auth, admin, async (req, res) => {
  let category = await Category.findByIdAndDelete(req.params.id);
  return res.send(category);
});

router.post("/", validateCategory, auth, admin, async (req, res) => {
  let category = new Category();
  category.name = req.body.name;
  category.bannerTitle = req.body.bannerTitle;
  category.logoTitle = req.body.logoTitle;
  category.paragraph = req.body.paragraph;
  category.logoName = req.body.logoName;
  category.logoSvg = req.body.logoSvg;
  category.logoJson = req.body.logoJson;

  let logo = new Logo();
  logo.name = req.body.logoName;
  logo.category = req.body.name;
  logo.logoSvg = req.body.logoSvg;
  logo.logoJson = req.body.logoJson;
  await logo.save();

  await category.save();
  return res.send(category);
});
module.exports = router;
