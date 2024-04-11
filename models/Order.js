const Sequelize = require("sequelize");
const sequelize = require("../Database/connect"); // Đường dẫn tới tệp cấu hình Sequelize của bạn
const Order = sequelize.define(
  "order",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    total_amount: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
  },
  {
    timestamps: true, // Thiết lập tùy chọn này để tự động bao gồm createdAt và updatedAt
  }
);

module.exports = Order;
