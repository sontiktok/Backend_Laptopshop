const express = require("express");
const User = require("../models/User");
const router = express.Router();
const authorization = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");
const Res = require("../helper/response");
const validator = require("../middlewares/validator");
const userSchema = require("../validations/userSchema");
const { where } = require("sequelize");

//admin/user/get-all-user
router.get(
  "/get-all-user",
  authentication,
  authorization("admin"),
  async function (req, res, next) {
    try {
      const users = await User.findAll();
      Res(res, 200, true, users, "List user");
    } catch (error) {
      console.error("Error fetching users:", error);
      Res(res, 500, false, null, "Internal server error");
    }
  }
);

router.put(
  "/update",
  authentication,
  validator(userSchema.updateUser),
  async function (req, res, next) {
    const id = req.user.id;
    const { fullName, phone, address } = req.body;
    try {
      const user = await User.update(
        { fullName, phone, address },
        {
          where: {
            id,
          },
        }
      );
      Res(res, 200, true, user, "User has been updated");
    } catch (error) {
      console.error("Error fetching users:", error);
      Res(res, 500, false, null, "Internal server error");
    }
  }
);
// Khách hàng quản lí đơn hàng
router.use("/order", authentication, require("./order"));

// Khách hàng quản lí bình luận
router.use("/comment", authentication, require("./comment"));

module.exports = router;
