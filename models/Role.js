const Sequelize = require("sequelize");
const sequelize = require("../Database/connect");
const Role = sequelize.define(
  "role",
  {
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
    timestamps: false,
  }
);

module.exports = Role;
