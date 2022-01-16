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

const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "reactapp0000@gmail.com",
    pass: "Waqas@121",
  },
});

router.post("/register", validateRegister, async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User with given Email already exist");
  user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  await user.generateHashedPassword();
  let token = jwt.sign(
    { _id: user._id, name: user.name, role: user.role },
    config.get("jwtPrivateKey")
  );
  await user.save();
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

router.post("/admin/login", validateLogin, async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User Not Registered");
  let isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(401).send("Invalid Password");
  if (user.role !== "admin") {
    res.status(401).send("This is admin Portal. Only admin can access it.");
  }
  let token = jwt.sign(
    { _id: user._id, name: user.name, role: user.role, email: user.email },
    config.get("jwtPrivateKey")
  );
  res.send(token);
});

//add logo into user's account
router.put("/save/:id", auth, async (req, res) => {
  let id = req.params.id;
  let logoData = req.body;
  if (logoData.logoSvg.length > 1) {
    let user = await User.findById(id);
    user.logos = [...user.logos, logoData];
    await user.save();
    return res.send("logo added into your account");
  }
  return res.status(400).send("Logo is not appear");
});
//Delete User's profile Logo
router.put("/deleteLogo/:id/", auth, async (req, res) => {
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
router.put("/save/:id/update", auth, async (req, res) => {
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
router.put("/:id", validateUpdated, auth, async (req, res) => {
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
//update user
router.put("/admin/:id", auth, admin, async (req, res) => {
  console.log("User > ");
  let user = await User.findById(req.params.id);

  if (!user) {
    return res.status(401).send("user not found");
  }

  user.role = req.body.role;
  await user.save();
  return res.send(`User converted into ${req.body.role}`);
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

router.get("/", auth, admin, async (req, res) => {
  let users = await User.find();
  console.log("Users 167> ", users);
  return res.send(users);
});

//forgot password
router.post("/forgot/password", async (req, res) => {
  console.log("Forget Password route");
  try {
    crypto.randomBytes(32, (error, buffer) => {
      if (error) {
        console.log(error.message);
      }
      const token = buffer.toString("hex");
      User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
          console.log("Invalid Email");
          return res.status(400).send("Please enter valid email");
        }
        user.resetToken = token;
        user.save().then((result) => {
          transporter.sendMail(
            {
              from: "no-replay@gmail.com",
              to: user.email,
              subject: "Reset Password",
              html: `<a href="http://localhost:3001/generatepassword/${token}">Click here to reset Password</a>`,
            },
            (error, info) => {
              if (error) {
                console.log(error);
                return res.json(error);
              } else {
                return res.json("email send:" + info.response);
              }
            }
          );
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.send(500).send("server error");
  }
});
//forgot password
router.post("/forgot/admin/password", async (req, res) => {
  console.log("Forget Password route");
  try {
    crypto.randomBytes(32, (error, buffer) => {
      if (error) {
        console.log(error.message);
      }
      const token = buffer.toString("hex");
      User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
          console.log("Invalid Email");
          return res.status(400).send("Please enter valid email");
        }
        if (user.role !== "admin") {
          console.log("role is not admin");
          return res
            .status(401)
            .send("Sorry! This portal is for admin access only");
        }
        user.resetToken = token;
        user.save().then((result) => {
          transporter.sendMail(
            {
              from: "no-replay@gmail.com",
              to: user.email,
              subject: "Reset Password",
              html: `<a href="http://localhost:3000/generatepassword/${token}">Click here to reset Password</a>`,
            },
            (error, info) => {
              if (error) {
                console.log(error);
                return res.send(error);
              } else {
                return res.send("email send to your given email account");
              }
            }
          );
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.send(500).send("server error");
  }
});

router.put("/new/password", async (req, res) => {
  const newPassword = req.body.password;
  const sendToken = req.body.token;
  if (!newPassword) {
    res.status(401).send("Please enter password");
  }
  console.log("Password > ", newPassword, "  Send Token > ", sendToken);
  User.findOne({ resetToken: req.body.token }).then((user) => {
    if (!user) {
      return res.status(401).send("Try Again session expired");
    }
    bcrypt.hash(newPassword, 12).then((hashedpassword) => {
      (user.password = hashedpassword),
        (user.resetToken = undefined),
        (user.expireToken = undefined),
        user.save().then((saveUser) => {
          res.send("Password changed");
        });
    });
  });
});

module.exports = router;
