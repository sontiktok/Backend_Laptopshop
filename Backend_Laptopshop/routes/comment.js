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
const Comment = require("../models/Comment");
const Order = require("../models/Order");
const { predictSentiment } = require("../CheckComment/checkComment");
//user crate comment
router.post("/create", authentication, async function (req, res, next) {
  const userId = req.user.id;
  const { productId, content } = req.body;
  try {
    // Kiểm tra xem sản phẩm có tồn tại trong bảng Product không
    const product = await Product.findByPk(productId);
    if (!product) {
      return Res(
        res,
        400,
        false,
        null,
        "Product does not exist. Cannot create comment."
      );
    }
    let show = true;
    const checkComment = await predictSentiment(content);
    if (checkComment.includes("NEG")) {
      show = false;
    }
    // Tạo comment mới
    const comment = await Comment.create({
      content,
      userId,
      productId,
      show,
    });

    // Trả về thông báo thành công nếu không có lỗi
    return Res(res, 200, true, comment, "Comment created successfully.");
  } catch (error) {
    // Xử lý lỗi nếu có
    Res(res, 500, false, null, error);
  }
});
//User update comment
router.put(
  "/update-comment/:id",
  authentication,
  async function (req, res, next) {
    const userId = req.user.id;
    const commentId = req.params.id;
    const { content } = req.body;

    try {
      const comment = await Comment.findOne({
        where: {
          id: commentId,
          userId: userId,
        },
      });

      if (!comment) {
        return Res(
          res,
          404,
          false,
          null,
          "Comment not found or you don't have permission to modify it."
        );
      }
      let show = true;
      const checkComment = await predictSentiment(content);
      if (checkComment.includes("NEG")) {
        show = false;
      }

      // Cập nhật nội dung của comment
      await Comment.update(
        { content: content, show: show },
        { where: { id: commentId } }
      );

      // Trả về thông báo thành công
      return Res(res, 200, true, null, "Comment updated successfully.");
    } catch (error) {
      Res(res, 500, false, null, error);
    }
  }
);
//User delete comment
router.put(
  "/delete-comment/:id",
  authentication,
  async function (req, res, next) {
    const userId = req.user.id;
    const commentId = req.params.id;
    try {
      const [affectedRows] = await Comment.update(
        { deleted: true, show: false },
        {
          where: {
            id: commentId,
            userId: userId,
          },
        }
      );

      // Kiểm tra xem có bản ghi nào bị ảnh hưởng hay không
      if (affectedRows === 0) {
        return Res(res, 404, false, null, "Comment not found");
      }

      return Res(res, 200, true, null, "Deleted successfully");
    } catch (error) {
      return Res(res, 500, false, null, error);
    }
  }
);
//Admin get all comment of a product
router.get(
  "/comment-product/:id",
  authentication,
  authorization("admin"),
  async function (req, res, next) {
    const productId = req.params.id;
    try {
      // Lấy ra tất cả các comment của sản phẩm có productId và show là true
      const comments = await Comment.findAll({
        where: {
          productId: productId,
          show: true,
        },
      });
      // Trả về danh sách comment
      return Res(res, 200, true, comments, "Comments retrieved successfully");
    } catch (error) {
      // Xử lý lỗi nếu có
      return Res(res, 500, false, null, error);
    }
  }
);
module.exports = router;
