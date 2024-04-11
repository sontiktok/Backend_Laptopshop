const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/brand", require("./brand"));
router.use("/auth", require("./auth"));
router.use("/product", require("./product"));
router.use("/order", require("./order"));
module.exports = router;
