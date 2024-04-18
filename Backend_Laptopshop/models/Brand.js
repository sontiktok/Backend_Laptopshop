const Sequelize = require("sequelize");
const sequelize = require("../Database/connect"); // Đường dẫn tới tệp cấu hình Sequelize của bạn

const Brand = sequelize.define(
  "brand",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false, // Thiết lập tùy chọn này để tự động bao gồm createdAt và updatedAt
  }
);

module.exports = Brand;
