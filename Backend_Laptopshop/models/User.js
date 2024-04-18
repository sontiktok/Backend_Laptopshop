const Sequelize = require("sequelize");
const sequelize = require("../Database/connect"); // Đường dẫn tới tệp cấu hình Sequelize của bạn
const Role = require("./Role");
const User = sequelize.define(
    "user",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        fullName: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        address: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        ResetPasswordToken: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        ResetPasswordExp: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    },
    {
        timestamps: false, // Thiết lập tùy chọn này để tự động bao gồm createdAt và updatedAt
    }
);
module.exports = User;
