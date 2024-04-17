const express = require("express");
const User = require("../models/User");
const router = express.Router();
const authorization = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");
const Res = require("../helper/response");
const validator = require("../middlewares/validator");
const userSchema = require("../validations/userSchema");
const { where } = require("sequelize");
//Admin quản lí brand
router.use("/brand", require("./brand"));
//Admin quản lí đơn hàng
router.use("/order", require("./order"));
//Admin quản lí sản phẩm
router.use("/product", require("./product"));
//Admin quản lí user
router.use("/user", require("./user"));
//Admin quan li comment
router.use("/comment", require("./comment"));

module.exports = router;
