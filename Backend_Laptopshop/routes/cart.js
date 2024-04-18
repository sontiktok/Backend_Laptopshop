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
const Cart = require("../models/Cart");

router.post(
    "/create",
    authentication,
    // validator(orderSchema.createOrder),
    async function (req, res, next) {
        try {
            const productId = req.body.product_id;
            const quantity = req.body.quantity;
            const userId = req.user.id;

            // Tìm kiếm sản phẩm trong đơn hàng của người dùng
            const existingCart = await Cart.findOne({
                where: { userId, productId }
            });

            if (existingCart) {
                // Nếu sản phẩm đã tồn tại trong đơn hàng của người dùng, cập nhật số lượng
                await existingCart.increment('quantity', { by: quantity });
                // Cập nhật số lượng sản phẩm trong kho
                await Product.decrement('quantity', { by: quantity, where: { id: productId } });
                Res(res, 201, true, existingCart, "Quantity updated successfully");
            } else {
                const orderProduct = await Cart.create({
                    userId,
                    productId,
                    quantity
                });

                // Giảm số lượng sản phẩm từ mảng sản phẩm
                await Product.decrement("quantity", {
                    by: quantity.quantity,
                    where: { id: productId },
                });

                Res(res, 201, true, orderProduct, "Add to cart successfully");
            }
        } catch (error) {
            console.error(error)
            Res(res, 500, false, null, error.message);
        }
    }
);

router.post(
    "/update-quantity",
    authentication,
    // validator(orderSchema.createOrder),
    async function (req, res, next) {
        try {
            const productId = req.body.product_id;
            const quantity = req.body.quantity;
            const userId = req.user.id;

            // Tìm kiếm sản phẩm trong đơn hàng của người dùng
            const existingCart = await Cart.findOne({
                where: { userId, productId }
            });

            if (existingCart) {
                if (existingCart.quantity > quantity) {
                    await Product.increment('quantity', { by: existingCart.quantity - quantity, where: { id: productId } });
                } else {
                    await Product.decrement('quantity', { by: quantity - existingCart.quantity, where: { id: productId } });
                }
                existingCart.quantity = quantity
                await existingCart.save();
                Res(res, 200, true, existingCart, "Quantity updated successfully");
            } else {
                Res(res, 400, true, {}, "Item not found");
            }
        } catch (error) {
            console.error(error)
            Res(res, 500, false, null, error.message);
        }
    }
);

router.post(
    "/delete",
    authentication,
    // validator(orderSchema.createOrder),
    async function (req, res, next) {
        try {
            const id = req.body.id;
            const userId = req.user.id;

            // Tìm kiếm sản phẩm trong đơn hàng của người dùng
            const existingCart = await Cart.findOne({
                where: { id, userId }
            });

            if (existingCart) {
                await Product.increment('quantity', { by: existingCart.quantity, where: { id: existingCart.productId } });
                await existingCart.destroy();
                Res(res, 200, true, {}, "Quantity delete successfully");
            } else {
                Res(res, 400, true, {}, "Item not found");
            }
        } catch (error) {
            console.error(error)
            Res(res, 500, false, null, error.message);
        }
    }
);

module.exports = router;
