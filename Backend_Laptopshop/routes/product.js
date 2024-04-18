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
const Brand = require("../models/Brand");

//get all product
router.get("/get-all", async function (req, res, next) {
  try {
    const page = parseInt(req.query.offset) || null;
    const pageSize = parseInt(req.query.limit) || 11;
    let productReturn = [];
    if (page !== null) {
      const { count, product } = await Product.findAndCountAll({
        limit: pageSize,
        offset: page/12 * pageSize,
      });
      productReturn = product
    } else {
      productReturn = await Product.findAll();
    }
    return Res(res, 200, true, productReturn, "Get all product successfully!");
  } catch (error) {
    return Res(res, 500, true, null, error.message);
  }
});
//get product by Id
router.get("/get-by-id/:id", async function (req, res, next) {
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
      let { name, description, price, quantity, brandId } = req.body;
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
        description,
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
    const { description, quantity, price } = req.body;
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return Res(res, 404, true, null, "Product not found");
      }
      await Product.update(
        { description, quantity, price },
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
//get all product by Brand
router.get("/get-by-brand/:id", async function (req, res, next) {
  const id = req.params.id;
  let brand;
  let listProduct;
  try {
    brand = await Brand.findOne({
      where: {
        id,
      },
    });
  } catch (error) {
    return Res(res, 404, false, null, error);
  }
  if (!brand) {
    return Res(res, 404, false, null, "Brand not found!");
  }
  try {
    listProduct = await Product.findAll({
      where: {
        brandId: id,
      },
    });
    return Res(res, 200, true, listProduct, `Products of brand: ${brand.name}`);
  } catch (error) {
    return Res(res, 404, false, null, error);
  }
});

//Get product by price
router.get("/sort/asc-price", async function (req, res, next) {
  console.log("Me may nah");
  try {
    console.log("Vai cacc");
    const listProduct = await Product.findAll({
      order: [["price", "ASC"]],
    });
    console.log(listProduct);
    return Res(res, 200, true, listProduct, `Products sort asc`);
  } catch (error) {
    return Res(res, 404, false, null, error);
  }
});
//Get product by price
router.get("/sort/desc-price", async function (req, res, next) {
  try {
    const listProduct = await Product.findAll({
      order: [["price", "DESC"]],
    });
    return Res(res, 200, true, listProduct, `Products sort desc`);
  } catch (error) {
    return Res(res, 404, false, null, error);
  }
});

module.exports = router;
