const express = require("express");
let router = express.Router();
const validateShapes = require("../../middlewares/validateShape");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
var { Shape } = require("../../models/shape");
//get logos
router.get("/", async (req, res) => {
  // console.log(req.user);
  let shapes = await Shape.find();
  return res.send(shapes);
});

//update a record
router.put("/:id", validateShapes, auth, admin, async (req, res) => {
  let icon = await Shape.findById(req.params.id);
  icon.name = req.body.name;
  icon.d = req.body.d;
  await icon.save();
  return res.send("Shape Updated successfuly");
});
//Delete a record
router.delete("/:id", auth, admin, async (req, res) => {
  let shape = await Shape.findByIdAndDelete(req.params.id);
  return res.send("Shape deleted successfuly");
});
//Insert a record
router.post("/", validateShapes, auth, admin, async (req, res) => {
  let shape = new Shape();
  shape.name = req.body.name;
  shape.d = req.body.d;
  await shape.save();
  return res.send("New shape addedd successfuly");
});
module.exports = router;
