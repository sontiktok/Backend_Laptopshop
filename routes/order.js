const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { where } = require("sequelize");
const authorization = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");
const Res = require("../helper/response");
const validator = require("../middlewares/validator");
const orderSchema = require("../validations/orderSchema");
const Order = require("../models/Order");
const OrderProduct = require("../models/OrderProduct");
//get all order
router.get(
  "/",
  authentication,
  authorization("user"),
  async function (req, res, next) {
    try {
      const listOrder = await Order.findAll();
      Res(res, 200, true, listOrder, "List order");
    } catch (error) {
      Res(res, 500, false, null, error.error);
    }
  }
);
//get order by userId
// Use for admin
router.get(
  "/getOrder/:userId",
  authentication,
  authorization("admin"),
  async function (req, res, next) {
    const userId = req.params.userId;
    try {
      const listOrder = await Order.findAll({
        where: {
          userId,
        },
      });
      Res(res, 200, true, listOrder, "List order of user");
    } catch (error) {
      Res(res, 500, false, null, error);
    }
  }
);

//get order of user
// Use for user
router.get("/my-order", authentication, async function (req, res, next) {
  const userId = req.user.id;
  try {
    const listOrder = await Order.findAll({
      where: {
        userId,
      },
    });
    Res(res, 200, true, listOrder, "Your order!");
  } catch (error) {
    Res(res, 500, false, null, error);
  }
});
// create product
router.post(
  "/create",
  authentication,
  // validator(orderSchema.createOrder),
  async function (req, res, next) {
    //lay ra mang san pham
    const listProduct = req.body.listProduct;
    console.log("oeihhhhhhhhhhhhhhhh     ", listProduct);
    const userId = req.user.id;
    try {
      const order = await Order.create({
        userId,
        status: "Ordered",
      });

      // Tạo một mảng chứa các object để chèn vào bảng OrderProduct
      const orderProducts = listProduct.map((product) => ({
        orderId: order.id,
        productId: product.productId,
        quantity: product.quantity,
      }));

      // Sử dụng bulkCreate() để chèn tất cả các object vào bảng OrderProduct
      await OrderProduct.bulkCreate(orderProducts);
      Res(res, 201, true, order, "Ordered successfully");
    } catch (error) {
      Res(res, 500, false, null, error.message);
    }
  }
);
module.exports = router;
