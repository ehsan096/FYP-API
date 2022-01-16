const express = require("express");
let router = express.Router();
const validateIcons = require("../../middlewares/validateIcon");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
var { Icon } = require("../../models/icon");
var { IconCategory } = require("../../models/iconCategory");
//get logos
router.get("/", async (req, res) => {
  // console.log(req.user);
  let logos = await Icon.find();
  return res.send(logos);
});

//update a record
router.put("/:id", validateIcons, auth, admin, async (req, res) => {
  let logoFind = await Icon.findOne({ name: req.body.name });
  // let logo = await Logo.findById(req.params.id);

  if (logoFind && logoFind.category === req.body.category) {
    return res.status(401).send(`Name should be unique in unique category `);
  }

  let icon = await Icon.findById(req.params.id);
  let category = await IconCategory.findOne({ iconName: icon.name });
  if (category) {
    if (category.name !== req.body.category) {
      return res
        .status(401)
        .send(`you cannot change Category of this Icon, this is Front Icon`);
    }
    category.name = category.name;
    category.d = req.body.d;
    category.color = category.color;
    category.iconName = req.body.name;
    await category.save();
  }
  // let icon = await Icon.findById(req.params.id);
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
  let icon = await Icon.findOne({ name: req.body.name });
  if (icon && icon.category === req.body.category) {
    return res.status(401).send(`${req.body.name} icon already exist`);
  }
  let logo = new Icon();
  logo.name = req.body.name;
  logo.category = req.body.category;
  logo.d = req.body.d;
  await logo.save();
  return res.send("Icon addedd successfuly");
});
module.exports = router;
