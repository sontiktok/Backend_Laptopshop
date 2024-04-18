// const express = require("express");
// require("express-async-errors");
// const config = require("./configs/config");
// const sequelize = require("./Database/connect");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");

// //
// const app = express();
// //middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors());
// app.use("/", require("./routes/index"));
// require("./models/User");
// require("./models/Role");
// require("./models/Brand");
// require("./models/Product");
// require("./models/Order");
// require("./models/Comment");
// require("./models/OrderProduct");
// require("./models/relationship");
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ error: "Lỗi server nội bộ" });
// });
// sequelize
//   .sync({ force: false })
//   .then(() => {
//     app.listen(config.PORT, () => {
//       console.log("Server is running on port ", config.PORT);
//     });
//   })
//   .catch((err) => {
//     console.log(
//       "Không thể khởi động server hoặc kết nối với cơ sở dữ liệu:",
//       err
//     );
//     process.exit(1);
//   });

const express = require("express");
require("express-async-errors");
const config = require("./configs/config");
const sequelize = require("./Database/connect");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { hashPassword } = require("./helper/auth");
const app = express();
const path = require('path');

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/", require("./routes/index"));
app.use(express.static(path.join(__dirname, 'public')));

// Import models
const User = require("./models/User");
const Role = require("./models/Role");
const Brand = require("./models/Brand");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Comment = require("./models/Comment");
const OrderProduct = require("./models/OrderProduct");
const Cart = require("./models/Cart");
const Relationship = require("./models/relationship");

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Lỗi server nội bộ" });
});

// Define initial data creation
const createInitialData = async () => {
    try {
        // Tìm kiếm hoặc tạo mới vai trò "admin"
        let adminRole = await Role.findOne({ where: { name: "admin" } });
        if (!adminRole) {
            adminRole = await Role.create({ name: "admin" });
        }
        // Tìm kiếm hoặc tạo mới vai trò "user"
        let userRole = await Role.findOne({ where: { name: "user" } });
        if (!userRole) {
            userRole = await Role.create({ name: "user" });
        }
        // Kiểm tra xem có dữ liệu người dùng nào chưa
        const usersCount = await User.count();
        if (usersCount === 0) {
            // Tạo người dùng mặc định nếu không có người dùng nào
            await User.create({
                email: config.EMAIL_ADMIN,
                username: config.USERNAME_ADMIN,
                password: hashPassword(config.PASSWORD_ADMIN),
                fullName: config.NAME_ADMIN,
                phone: config.PHONE_ADMIN,
                address: config.ADDRESS_ADMIN,
                roleId: adminRole.id,
            });
        }
    } catch (error) {
        console.error("Lỗi khi tạo dữ liệu ban đầu:", error);
    }
};
// Đồng bộ hóa cơ sở dữ liệu và khởi động máy chủ
sequelize
    .sync({ force: false })
    .then(() => {
        // Tạo dữ liệu ban đầu sau khi cơ sở dữ liệu được đồng bộ hóa
        return createInitialData();
    })
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
