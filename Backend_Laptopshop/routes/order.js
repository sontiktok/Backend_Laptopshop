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
const Cart = require("../models/Cart");
//Tat ca don hang cua user
//user/order/my-order
router.get("/my-order", authentication, async function (req, res, next) {
    const userId = req.user.id;
    try {
        const listOrder = await Order.findAll({
            where: {
                userId,
                deleted: false,
            },
        });
        Res(res, 200, true, listOrder, "List order of user");
    } catch (error) {
        Res(res, 500, false, null, error.error);
    }
});
// Tao don hang tu user
// user/order/create
router.post(
    "/create",
    authentication,
    // validator(orderSchema.createOrder),
    async function (req, res, next) {
        //lay ra mang san pham
        const listProduct = req.body.listProduct;
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

            // Giảm số lượng sản phẩm từ mảng sản phẩm
            for (const product of listProduct) {
                await Product.decrement("quantity", {
                    by: product.quantity,
                    where: { id: product.productId },
                });
            }
            Res(res, 201, true, order, "Ordered successfully");
        } catch (error) {
            Res(res, 500, false, null, error.message);
        }
    }
);
//Xem chi tiet don hang
//user/order/detail-order/id

router.get(
    "/detail-order/:orderId",
    authentication,
    async function (req, res, next) {
        const { orderId } = req.params;
        try {
            // Tìm đơn hàng và kiểm tra xem có tồn tại không
            const order = await Order.findOne({
                where: {
                    id: orderId,
                    deleted: false, // Chỉ lấy đơn hàng không bị xóa mềm
                },
            });
            if (!order) {
                return Res(res, 404, false, null, "Order not found");
            }

            // Lấy chi tiết đơn hàng chỉ từ đơn hàng không bị xóa mềm
            const orderDetail = await OrderProduct.findAll({
                where: {
                    orderId,
                },
            });

            // Chuyển đổi dữ liệu chi tiết đơn hàng
            const transformedOrderDetail = await Promise.all(
                orderDetail.map(async (item) => {
                    const product = await Product.findByPk(item.productId);
                    return {
                        productId: item.productId,
                        name: product.name,
                        price: product.price,
                        quantity: item.quantity,
                        totalAmount: product.price * item.quantity,
                    };
                })
            );
            Res(res, 200, true, transformedOrderDetail, "Detail order!");
        } catch (error) {
            Res(res, 500, false, null, error);
        }
    }
);

//Thay doi so luong san pham cua 1 don hang
// /user/order/change-quantity/orderId
router.put(
    "/change-quantity/:orderId",
    authentication,
    async function (req, res, next) {
        const { orderId } = req.params;
        const { listProduct } = req.body;
        try {
            // Lặp qua mỗi sản phẩm trong danh sách sản phẩm mới
            for (const item of listProduct) {
                const { productId, quantity } = item;

                // Tìm kiếm sản phẩm trong đơn hàng
                const orderProduct = await OrderProduct.findOne({
                    where: {
                        orderId,
                        productId,
                    },
                });

                // Nếu sản phẩm không tồn tại trong đơn hàng, bỏ qua và tiếp tục với sản phẩm tiếp theo
                if (!orderProduct) {
                    continue;
                }

                // Cập nhật số lượng của sản phẩm
                await orderProduct.update({ quantity });
            }

            // Sau khi cập nhật thành công, trả về thông điệp thành công
            Res(res, 200, true, null, "Quantity updated successfully!");
        } catch (error) {
            // Xử lý lỗi nếu có
            Res(res, 500, false, null, error);
        }
    }
);
//Xoa  san pham ra khoi  don hang
// /user/order/delete-products/orderId
router.delete(
    "/delete-products/:orderId",
    authentication,
    async function (req, res, next) {
        const { orderId } = req.params;
        const { productIds } = req.body; // Lấy mảng các productId từ body request
        try {
            // Duyệt qua mỗi productId để xóa sản phẩm khỏi đơn hàng
            for (const productId of productIds) {
                // Tìm sản phẩm trong đơn hàng dựa vào orderId và productId
                const orderProduct = await OrderProduct.findOne({
                    where: {
                        orderId,
                        productId,
                    },
                });

                // Nếu không tìm thấy sản phẩm trong đơn hàng, tiếp tục với sản phẩm tiếp theo
                if (!orderProduct) {
                    continue;
                }

                // Xóa sản phẩm khỏi đơn hàng
                await orderProduct.destroy();
            }

            // Trả về thông báo thành công
            Res(res, 200, true, null, "Products deleted from order successfully!");
        } catch (error) {
            // Xử lý lỗi nếu có
            Res(res, 500, false, null, error);
        }
    }
);
// Xoa don hang
router.put(
    "/delete-order/:orderId",
    authentication,
    async function (req, res, next) {
        const { orderId } = req.params;
        try {
            // Tìm đơn hàng cần xóa
            const order = await Order.findByPk(orderId);
            if (!order) {
                return Res(res, 404, false, null, "Order not found!");
            }
            // Thực hiện xóa mềm bằng cách đặt trường deleted thành true
            await order.update({ deleted: true });
            // Trả về thông báo thành công
            Res(res, 200, true, null, "Order deleted successfully!");
        } catch (error) {
            // Xử lý lỗi nếu có
            Res(res, 500, false, null, error);
        }
    }
);
//Lay tat ca cac don hang cua cac user
// admin/order/list-order
router.get(
    "/list-order",
    authentication,
    authorization("admin"),
    async function (req, res, next) {
        try {
            const listOrder = await Order.findAll();
            Res(res, 200, true, listOrder, "All order!");
        } catch (error) {
            Res(res, 500, false, null, error);
        }
    }
);
//Lay tat ca don hang cua 1 user truyen vao user id
//admin/order/get-all-order/id
router.get(
    "/get-all-order/:userId",
    authentication,
    authorization("admin"),
    async function (req, res, next) {
        const userId = req.params.userId;
        try {
            const listOrder = await Order.findAll({
                where: {
                    userId,
                    deleted: false,
                },
            });
            Res(res, 200, true, listOrder, "List order of user");
        } catch (error) {
            Res(res, 500, false, null, error);
        }
    }
);

//Cap nhat trang thai don dang
// admin/order/update-status/8
router.put(
    "/update-status/:id",
    authentication,
    authorization("admin"),
    async function (req, res, next) {
        try {
            const id = req.params.id;
            const status = req.body.status;

            // Tìm kiếm đơn hàng
            const order = await Order.findOne({
                where: { id, deleted: false },
            });

            // Nếu không tìm thấy đơn hàng, trả về lỗi 404
            if (!order) {
                return Res(res, 404, false, null, "Order not found");
            }

            // Cập nhật trạng thái đơn hàng
            await Order.update({ status }, { where: { id } });
            // Trả về thông báo thành công
            return Res(res, 200, true, null, "Updated order status!");
        } catch (error) {
            // Xử lý lỗi nếu có
            Res(res, 500, false, null, error);
        }
    }
);

router.get(
    "/cart",
    authentication,
    async function (req, res, next) {
        const userId = req?.user?.id;
        try {
            console.log('====================================');
            console.log(userId);
            console.log('====================================');
            const cartDetail = await Cart.findAll({
                where: {
                    userId: userId,
                    deleted: false
                },
            });

            const transformedOrderDetail = await Promise.all(
                cartDetail.map(async (item) => {
                    const product = await Product.findByPk(item.productId);
                    return {
                        productId: item.productId,
                        name: product.name,
                        price: product.price,
                        quantity: item.quantity,
                        image: product.image,
                        totalAmount: product.price * item.quantity,
                        description: product.description,
                        id: item.id
                    };
                })
            );
            Res(res, 200, true, transformedOrderDetail, "Detail cart!");
        } catch (error) {
            console.log(error);
            Res(res, 500, false, null, error);
        }
    }
);

router.post(
    "/cart",
    authentication,
    async function (req, res, next) {
        const userId = req?.user?.id;
        const total = req?.body?.total;
        const { listProduct } = req.body
        try {
            console.log('====================================');
            console.log(listProduct);
            console.log('====================================');

            const order = await Order.create({
                userId,
                status: "Ordered",
                total_amount: parseFloat(total)
            });

            for (let index = 0; index < listProduct.length; index++) {
                const element = listProduct[index];
                // Tìm kiếm đơn hàng
                const record = await OrderProduct.findOne({
                    where: { userId: userId, productId: listProduct[index].productId, deleted: false },
                });

                if (!record) {
                    OrderProduct.create({
                        orderId: order.id,
                        userId: userId,
                        productId: listProduct[index].productId,
                        quantity: listProduct[index].quantity,
                    })
                } else {
                    // Cập nhật trạng thái đơn hàng
                    await OrderProduct.update({
                        quantity: listProduct[index].quantity,
                        orderId: order.id
                    }, { where: { userId: userId, productId: listProduct[index].productId } });
                }

                // Cập nhật trạng thái các mục trong giỏ hàng là đã xóa
                await Cart.destroy({
                    where: { userId: userId }
                });
            }

            Res(res, 200, true, listProduct, "updated cart!");
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
            Res(res, 500, false, null, error);
        }
    }
);

module.exports = router;
