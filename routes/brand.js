const express = require("express");
const router = express.Router();
const Brand = require("../models/Brand");
const { where } = require("sequelize");
const authorization = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");
//get all brand
router.get(
  "/getAll",
  authentication,
  authorization("user"),
  async function (req, res, next) {
    const Brands = await Brand.findAll();
    res.status(200).json({
      success: true,
      data: Brands,
    });
  }
);
//get brand by Id
router.get("/getBrandById/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    const brand = await Brand.findByPk(id);
    if (brand) {
      // Kiểm tra xem có tìm thấy brand không
      res.status(200).json({
        success: true,
        data: brand,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      err: error.message,
    });
  }
});
//create brand
router.post("/create", async function (req, res, next) {
  const { name, desc } = req.body;
  const brand = await Brand.create({ name, desc });
  res.status(201).json({
    success: true,
    data: brand,
  });
});
//update
router.put("/update/:id", async function (req, res, next) {
  const { id } = req.params;
  const { desc } = req.body;
  try {
    const brand = await Brand.findByPk(id);
    if (brand) {
      await Brand.update(
        { desc: desc },
        {
          where: {
            id,
          },
        }
      );
      res.status(200).json({
        success: true,
        massage: "Update succesfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      err: error.message,
    });
  }
});
module.exports = router;
