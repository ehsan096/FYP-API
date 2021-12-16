const express = require("express");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
let router = express.Router();
let { User } = require("../../models/user");
var bcrypt = require("bcryptjs");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const validateLogin = require("../../middlewares/validateLogin");
const validateRegister = require("../../middlewares/validateRegister");
const validateUpdated = require("../../middlewares/validateUpdated");
const config = require("config");
router.post("/register", validateRegister, async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User with given Email already exist");
  user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  await user.generateHashedPassword();
  await user.save();
  let token = jwt.sign(
    { _id: user._id, name: user.name, role: user.role },
    config.get("jwtPrivateKey")
  );

  return res.send(token);
});
router.post("/login", validateLogin, async (req, res) => {
  console.log("after validation");
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User Not Registered");
  let isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(401).send("Invalid Password");
  let token = jwt.sign(
    { _id: user._id, name: user.name, role: user.role },
    config.get("jwtPrivateKey")
  );
  res.send(token);
});

//add logo into user's account
router.put("/save/:id", async (req, res) => {
  let id = req.params.id;
  let logoData = req.body;
  console.log("Logo Data ", logoData);
  if (logoData.logoSvg.length > 1) {
    let user = await User.findById(id);
    user.logos = [...user.logos, logoData];
    await user.save();
    return res.send("New logo added into your account");
  } else {
    return res.status(400).send("Logo is not appear");
  }
  // console.log(logoData);
});
//Delete User's profile Logo
router.put("/deleteLogo/:id/", async (req, res) => {
  let id = req.params.id;
  let logoData = req.body;

  if (logoData.logoSvg.length > 1) {
    let user = await User.findById(id);
    let i = user.logos.findIndex(checkLogo);
    function checkLogo(logo) {
      return logo._id === logoData._id;
    }
    if (i === -1) {
      return res.status(400).send("Logo not found for deletion");
    } else {
      let logo = [...user.logos];
      logo.splice(i, 1);
      user.logos = logo;
    }

    await user.save();
    return res.send("Your logo deleted successfuly");
  } else {
    return res.status(400).send("Logo is not appear");
  }
  // console.log(logoData);
});
//update logo into user's account
router.put("/save/:id/update", async (req, res) => {
  let id = req.params.id;
  let logoData = req.body;
  // console.log(logoData);

  let user = await User.findById(id);
  let logo = [...user.logos];
  if (logo.length >= 0) {
    let i = logo.findIndex(checkLogo);

    function checkLogo(logoo) {
      return logoo._id === logoData._id;
    }
    if (i === -1) {
      return res.status(400).send("Logo not found for updation");
    } else {
      console.log("Check > ", i);
      logo[i] = logoData;
      user.logos = logo;
    }

    await user.save();
    return res.send("Your logo updated successfuly");
  }
  return res.status(400).send("Logo not found");
});
//update user
router.put("/:id", validateUpdated, async (req, res) => {
  let user = await User.findById(req.params.id);
  user.name = req.body.name;
  user.email = req.body.email;
  if (req.body.password) {
    let isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      user.password = req.body.password;

      await user.generateHashedPassword();
    } else {
      return res.status(401).send("You have enter the same password");
    }
  } else {
    user.password = user.password;
  }
  await user.save();
  let token = jwt.sign(
    { _id: user._id, name: user.name, role: user.role },
    config.get("jwtPrivateKey")
  );
  return res.send(token);
});

// get speicific user
router.get("/:id", async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user) return res.status(400).send("You need to register ");
  return res.send(user);
});
// Delete speicific user's
router.delete("/:id", auth, admin, async (req, res) => {
  let user = await User.findByIdAndRemove(req.params.id);
  return res.send("user Deleted successfuly");
});

router.get("/", async (req, res) => {
  let users = await User.find();
  return res.send(users);
});

module.exports = router;
