const express = require("express");
let router = express.Router();
const validateIcnCategory = require("../../middlewares/validateIconCategory");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
var { IconCategory } = require("../../models/iconCategory");
var { Icon } = require("../../models/icon");
//get categories
router.get("/", async (req, res) => {
  let categories = await IconCategory.find();
  let total = await IconCategory.countDocuments();
  return res.send({ total, categories });
});
//update a record
router.put("/:id", validateIcnCategory, auth, admin, async (req, res) => {
  let category = await IconCategory.findById(req.params.id);

  let CategoryName = category.name;
  let CategoryIconName = category.iconName;
  let chkCat = await IconCategory.findOne({ name: req.body.name });
  if (chkCat && chkCat.name !== CategoryName) {
    return res
      .status(401)
      .send(
        `${req.body.name} Category already exist, Please change Category Name`
      );
  }

  if (category) {
    if (req.body.name !== CategoryName) {
      let icon = await Icon.findOne({ name: req.body.iconName });
      if (icon && icon.category === CategoryName) {
        return res
          .status(401)
          .send(
            `${req.body.iconName} icon already exist please change iconName`
          );
      } else {
        console.log("else part");
        let lg = await Icon.updateOne(
          { name: CategoryIconName },
          {
            $set: {
              name: req.body.iconName,
              category: req.body.name,
              d: req.body.d,
            },
          }
        );

        let logo = await Icon.updateMany(
          { category: CategoryName },
          {
            $set: {
              category: req.body.name,
            },
          }
        );
      }
    } else if (req.body.name === CategoryName) {
      let icon = await Icon.findOne({ name: req.body.iconName });
      if (icon && icon.category === CategoryName) {
        return res
          .status(401)
          .send(
            `${req.body.iconName} icon already exist please change icon Name`
          );
      } else {
        console.log("else part");
        let lg = await Icon.updateOne(
          { name: CategoryIconName },
          {
            $set: {
              name: req.body.iconName,
              category: req.body.name,
              d: req.body.d,
            },
          }
        );
      }
    }

    category.name = req.body.name;
    category.d = req.body.d;
    category.color = req.body.color;
    category.iconName = req.body.iconName;
    await category.save();
    return res.send("Icon category Updated successfuly");
  }
  return res.status(400).send("Category not found to update");
});
//Delete a record
router.delete("/:id", auth, admin, async (req, res) => {
  let category = await IconCategory.findByIdAndDelete(req.params.id);
  return res.send("category deleted Successfuly");
});

router.post("/", validateIcnCategory, auth, admin, async (req, res) => {
  let check = await IconCategory.findOne({ name: req.body.name });
  if (check) {
    return res.status(401).send(`${req.body.name} Category already exsist`);
  }
  let logo = new Icon();
  logo.name = req.body.iconName;
  logo.category = req.body.name;
  logo.d = req.body.d;
  await logo.save();

  let category = new IconCategory();
  category.name = req.body.name;
  category.d = req.body.d;
  category.color = req.body.color;
  category.iconName = req.body.iconName;

  await category.save();
  return res.send("Category created successfuly");
});
module.exports = router;
