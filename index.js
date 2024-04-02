const express = require("express");
const app = express();
const PORT = 3000;
const sequelize = require("./Database/connect");
const User = require("./models/User");
const Role = require("./models/Role");
const Brand = require("./models/Brand");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Comment = require("./models/Comment");
const OrderProduct = require("./models/OrderProduct");
require("./models/relationship");
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port 3000");
  });
});
