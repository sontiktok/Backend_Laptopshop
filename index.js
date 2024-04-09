const express = require("express");
const app = express();
const config = require("./configs/config");
const sequelize = require("./Database/connect");
app.use(express.json());
app.use("/", require("./routes/index"));
require("./models/User");
require("./models/Role");
require("./models/Brand");
require("./models/Product");
require("./models/Order");
require("./models/Comment");
require("./models/OrderProduct");
require("./models/relationship");
sequelize.sync({ force: false }).then(() => {
  app.listen(config.PORT, () => {
    console.log("Server is running on port ", config.PORT);
  });
});
