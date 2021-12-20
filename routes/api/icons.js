const express = require("express");
let router = express.Router();
const validateIcons = require("../../middlewares/validateIcon");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
var { Icon } = require("../../models/icon");
//get logos
router.get("/", async (req, res) => {
  // console.log(req.user);
  let logos = await Icon.find();
  return res.send(logos);
});

//update a record
router.put("/:id", validateIcons, auth, admin, async (req, res) => {
  let icon = await Icon.findById(req.params.id);
  icon.name = req.body.name;
  icon.category = req.body.category;
  icon.d = req.body.d;
  await icon.save();
  return res.send("icon Updated successfuly");
});
//Delete a record
router.delete("/:id", auth, admin, async (req, res) => {
  let icon = await Icon.findByIdAndDelete(req.params.id);
  return res.send("Icon deleted successfuly");
});
//Insert a record
router.post("/", validateIcons, auth, admin, async (req, res) => {
  let logo = new Icon();
  logo.name = req.body.name;
  logo.category = req.body.category;
  logo.d = req.body.d;
  await logo.save();
  return res.send("Icon addedd successfuly");
});
module.exports = router;
