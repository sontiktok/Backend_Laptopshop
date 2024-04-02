const Sequelize = require("sequelize");
const sequelize = require("../Database/connect"); // Đường dẫn tới tệp cấu hình Sequelize của bạn

const Comment = sequelize.define(
  "comment",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Thiết lập tùy chọn này để tự động bao gồm createdAt và updatedAt
  }
);
module.exports = Comment;
