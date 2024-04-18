const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/brand", require("./brand"));
router.use("/auth", require("./auth"));
router.use("/product", require("./product"));
router.use("/order", require("./order"));
router.use("/admin", require("./admin"));
router.use("/comment", require("./comment"));
router.use("/cart", require("./cart"));
module.exports = router;
