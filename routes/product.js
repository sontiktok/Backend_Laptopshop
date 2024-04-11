const express = require("express");
const router = express.Router();
const { where } = require("sequelize");
const authorization = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");
const Res = require("../helper/response");
const validator = require("../middlewares/validator");
const productSchema = require("../validations/productSchema");
const Product = require("../models/Product");
const getAllBrandIds = require("../helper/getBrandId");
const upload = require("../configs/multerConfig");
const fs = require("fs");
const path = require("path");

//get all product
router.get("/", async function (req, res, next) {
  try {
    const product = await Product.findAll();
    return Res(res, 200, true, product, "Get all product successfully!");
  } catch (error) {
    return Res(res, 500, true, null, error.message);
  }
});
//get product by Id
router.get("/getProductById/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return Res(res, 404, false, null, "Product is not found");
    }
    return Res(res, 200, true, product, "Get product successfully!");
  } catch (error) {
    return Res(res, 500, false, null, error.massage);
  }
});
//create product
router.post(
  "/create",
  authentication,
  authorization("admin"),
  // validator(productSchema.createProduct),
  upload.single("image"),
  async function (req, res, next) {
    try {
      let { name, desc, price, quantity, brandId } = req.body;
      const image = req.file ? req.file.filename : "";
      price = parseFloat(price);
      (quantity = parseInt(quantity)), (brandId = parseInt(brandId));
      const arrBrandId = await getAllBrandIds();
      const checkBrandId = arrBrandId.includes(brandId);
      if (!checkBrandId) {
        if (req.file && req.file.filename) {
          fs.unlinkSync(
            path.join(__dirname, "../public/images", req.file.filename)
          );
        }
        return Res(res, 404, false, null, "BrandId invalid!");
      }
      const product = await Product.create({
        name,
        desc,
        price,
        quantity,
        image,
        brandId,
      });
      return Res(res, 201, true, product, "Create product successfully");
    } catch (error) {
      // Xử lý lỗi cho cả getAllBrandIds và Product.create tại đây
      if (req.file && req.file.filename) {
        fs.unlinkSync(
          path.join(__dirname, "../public/images", req.file.filename)
        );
      }
      console.error(error);
      return Res(res, 500, false, null, "An error occurred");
    }
  }
);

//update
router.put(
  "/update/:id",
  authentication,
  authorization("admin"),
  validator(productSchema.updateProduct),
  async function (req, res, next) {
    const { id } = req.params;
    const { desc, quantity, price } = req.body;
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return Res(res, 404, true, null, "Product not found");
      }
      await Product.update(
        { desc, quantity, price },
        {
          where: {
            id,
          },
        }
      );
      return Res(res, 200, true, null, "Update product successfully.");
    } catch (error) {
      return Res(res, 404, true, null, error.massage);
    }
  }
);
module.exports = router;
