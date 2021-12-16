const express = require("express");
let router = express.Router();
const validateCategory = require("../../middlewares/validateCategory");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
var { Category } = require("../../models/category");
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
  await category.save();
  return res.send(category);
});
module.exports = router;
