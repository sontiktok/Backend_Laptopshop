const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/brand", require("./brand"));
router.use("/auth", require("./auth"));
module.exports = router;
