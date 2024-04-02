const Sequelize = require("sequelize");
const sequelize = require("../Database/connect"); // Đường dẫn tới tệp cấu hình Sequelize của bạn
const Role = sequelize.define(
  "role",
  {
    // Định nghĩa các trường của bảng
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.ENUM("admin", "user"),
      allowNull: false,
    },
  },
  {
    timestamps: false, // Thiết lập tùy chọn này để tự động bao gồm createdAt và updatedAt
  }
);

module.exports = Role;
