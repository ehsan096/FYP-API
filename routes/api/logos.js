const express = require("express");
let router = express.Router();
const validateLogo = require("../../middlewares/validateLogo");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
var { Logo } = require("../../models/logo");
//get logos
router.get("/", async (req, res) => {
  // console.log(req.user);
  let logos = await Logo.find();
  return res.send(logos);
});

//update a record
router.put("/:id", validateLogo, auth, admin, async (req, res) => {
  let logoFind = await Logo.findOne({ name: req.params.name });
  if (logoFind) {
    return res.status(401).send(`Name should be unique already exist`);
  }
  let logo = await Logo.findById(req.params.id);
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
