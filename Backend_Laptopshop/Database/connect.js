const Sequelize = require("sequelize");
const config = require("../configs/config");
const sequelize = new Sequelize(
  config.DATABASE_NAME,
  config.USERNAME,
  config.PASSWORD,
  {
    host: "localhost",
    port: "3306",
    dialect: "mysql",
    logging: false,
    // logging: console.log,
  }
);
module.exports = sequelize;
