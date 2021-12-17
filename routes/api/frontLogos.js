const express = require("express");
let router = express.Router();
const validateLogo = require("../../middlewares/validateLogo");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
var { FrontLogo } = require("../../models/frontLogo");
var { Logo } = require("../../models/logo");
//get logos
router.get("/", async (req, res) => {
  // console.log(req.user);
  let frontLogos = await FrontLogo.find();
  return res.send(frontLogos);
});

//update a record
router.put("/:id", validateLogo, auth, admin, async (req, res) => {
  let frontLogo = await FrontLogo.findById(req.params.id);
  frontLogo.name = req.body.name;
  frontLogo.category = req.body.category;
  frontLogo.logoSvg = req.body.logoSvg;
  frontLogo.logoJson = req.body.logoJson;
  await frontLogo.save();
  return res.send(frontLogo);
});
//Delete a record
router.delete("/:id", auth, admin, async (req, res) => {
  let frontLogo = await FrontLogo.findByIdAndDelete(req.params.id);
  return res.send(frontLogo);
});
//Insert a record
router.post("/", validateLogo, auth, admin, async (req, res) => {
  let frontLogo = new FrontLogo();
  frontLogo.name = req.body.name;
  frontLogo.category = req.body.category;
  frontLogo.logoSvg = req.body.logoSvg;
  frontLogo.logoJson = req.body.logoJson;
  await frontLogo.save();
  return res.send(frontLogo);
});
module.exports = router;
