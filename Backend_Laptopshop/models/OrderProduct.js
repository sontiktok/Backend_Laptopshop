const Sequelize = require("sequelize");
const sequelize = require("../Database/connect");
const Order = require("./Order");
const Product = require("./Product");
const User = require("./User");
const OrderProduct = sequelize.define(
    "order_product",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        orderId: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        productId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Product,
                key: "id",
            },
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
    },
    {
        timestamps: false, // Thiết lập tùy chọn này để tự động bao gồm createdAt và updatedAt
    }
);

module.exports = OrderProduct;
