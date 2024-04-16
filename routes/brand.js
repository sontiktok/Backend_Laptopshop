const express = require("express");
const router = express.Router();
const Brand = require("../models/Brand");
const { where } = require("sequelize");
const authorization = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");
const Res = require("../helper/response");
const validator = require("../middlewares/validator");
const brandSchema = require("../validations/brandSchema");
//get all brand
router.get("/", async function (req, res, next) {
  const Brands = await Brand.findAll();
  return Res(res, 200, true, Brands, "Get all brand successfully!");
});
//get brand by Id
router.get("/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    const brand = await Brand.findByPk(id);
    if (!brand) {
      return Res(res, 404, false, null, "Brand is not found");
    }
    return Res(res, 200, true, brand, "Get all brand successfully!");
  } catch (error) {
    return Res(res, 500, false, null, error.massage);
  }
});
//create brand
router.post(
  "/",
  authentication,
  authorization("admin"),
  validator(brandSchema.createBrand),
  async function (req, res, next) {
    const { name, description } = req.body;
    const brand = await Brand.create({ name, description });
    return Res(res, 201, true, brand, "Create brand successfully");
  }
);
//update
router.put(
  "/:id",
  authentication,
  authorization("admin"),
  validator(brandSchema.updateBrand),
  async function (req, res, next) {
    const { id } = req.params;
    const { newDesc } = req.body;
    try {
      const brand = await Brand.findByPk(id);
      if (!brand) {
        return Res(res, 404, true, null, "Brand not found");
      }
      await Brand.update(
        { description: newDesc },
        {
          where: {
            id,
          },
        }
      );
      return Res(res, 200, true, null, "Update brand successfully.");
    } catch (error) {
      return Res(res, 404, true, null, error.massage);
    }
  }
);

module.exports = router;
