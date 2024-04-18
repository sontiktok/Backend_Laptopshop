const Sequelize = require("sequelize");
const sequelize = require("../Database/connect");
const Product = require("./Product");
const Cart = sequelize.define(
    "carts",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
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
        timestamps: false
    }
);

module.exports = Cart;
