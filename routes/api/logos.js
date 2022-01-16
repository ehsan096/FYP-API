const express = require("express");
let router = express.Router();
const validateLogo = require("../../middlewares/validateLogo");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
var { Category } = require("../../models/category");
var { Logo } = require("../../models/logo");
//get logos
router.get("/", async (req, res) => {
  // console.log(req.user);
  let logos = await Logo.find();
  return res.send(logos);
});

//update a record
router.put("/:id", validateLogo, auth, admin, async (req, res) => {
  let logoFind = await Logo.findOne({ name: req.body.name });
  // let logo = await Logo.findById(req.params.id);

  if (logoFind && logoFind.category === req.body.category) {
    return res.status(401).send(`Name should be unique in unique category `);
  }

  let logo = await Logo.findById(req.params.id);
  let category = await Category.findOne({ logoName: logo.name });
  if (category) {
    if (category.name !== req.body.category) {
      return res
        .status(401)
        .send(`you cannot change Category of this logo, this is Front logo`);
    }
    category.name = category.name;
    category.bannerTitle = category.bannerTitle;
    category.logoTitle = category.logoTitle;
    category.paragraph = category.paragraph;
    category.logoName = req.body.name;
    category.svgString = category.svgString;
    category.logoSvg = req.body.logoSvg;
    category.logoJson = req.body.logoJson;
    await category.save();
  }

  logo.name = req.body.name;
  logo.category = req.body.category;
  logo.logoSvg = req.body.logoSvg;
  logo.logoJson = req.body.logoJson;
  await logo.save();
  return res.send("Logo Updated Successfuly");
});
//Delete a record
router.delete("/:id", auth, admin, async (req, res) => {
  let logo = await Logo.findByIdAndDelete(req.params.id);
  return res.send("Logo deleted Successfuly");
});
//Insert a record
router.post("/", validateLogo, auth, admin, async (req, res) => {
  let logofind = await Logo.findOne({ name: req.body.name });
  if (logofind && logofind.category === req.body.category) {
    return res
      .status(401)
      .send(
        `${req.body.name} is already exist in ${req.body.category} category`
      );
  }
  let logo = new Logo();
  logo.name = req.body.name;
  logo.category = req.body.category;
  logo.logoSvg = req.body.logoSvg;
  logo.logoJson = req.body.logoJson;
  await logo.save();
  return res.send("New Logo added");
});
module.exports = router;
