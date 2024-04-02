const Sequelize = require("sequelize");
const config = require("../configs/config");
const sequelize = new Sequelize(
  config.DATABASE_NAME,
  config.USERNAME,
  config.PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);
module.exports = sequelize;
