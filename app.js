const express = require("express");
require("express-async-errors");
const config = require("./configs/config");
const sequelize = require("./Database/connect");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//
const app = express();
//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/", require("./routes/index"));
require("./models/User");
require("./models/Role");
require("./models/Brand");
require("./models/Product");
require("./models/Order");
require("./models/Comment");
require("./models/OrderProduct");
require("./models/relationship");
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Lỗi server nội bộ" });
});
sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(config.PORT, () => {
      console.log("Server is running on port ", config.PORT);
    });
  })
  .catch((err) => {
    console.log(
      "Không thể khởi động server hoặc kết nối với cơ sở dữ liệu:",
      err
    );
    process.exit(1);
  });
