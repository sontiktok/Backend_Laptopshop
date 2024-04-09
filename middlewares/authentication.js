const jwt = require("jsonwebtoken");
const config = require("../configs/config");
const User = require("../models/User");
const { where } = require("sequelize");

module.exports = async function (req, res, next) {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.status(403).json({
      success: false,
      massage: "Unauthorize",
    });
  }
  let token = req.headers.authorization.split(" ")[1];
  try {
    let result = jwt.verify(token, config.JWT_SECRET_KEY);
    const user = await User.findOne({
      where: {
        id: result.id,
      },
    });
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      massage: "Unauthorize ne",
    });
  }
};
