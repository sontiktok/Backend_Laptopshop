const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../configs/config");
const crypto = require("crypto");
const User = require("../models/User");
//Hash password
const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

//Check password
const checkPassword = (inputPass, currentPass) => {
  return bcrypt.compareSync(inputPass, currentPass);
};

//Get token
const getToken = (userId) => {
  const token = jwt.sign({ id: userId }, config.JWT_SECRET_KEY, {
    expiresIn: config.JWT_EXP_IN,
  });
  return token;
};
//
const genTokenResetPassword = async (id) => {
  // Tạo chuỗi token ngẫu nhiên
  const resetPasswordToken = crypto.randomBytes(20).toString("hex");
  try {
    // Cập nhật dữ liệu của người dùng trong cơ sở dữ liệu
    await User.update(
      {
        ResetPasswordToken: resetPasswordToken,
        ResetPasswordExp: Date.now() + 10 * 60 * 1000,
      },
      {
        where: { id },
      }
    );
    return resetPasswordToken;
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error updating user data:", error);
    throw error;
  }
};
module.exports = {
  hashPassword,
  checkPassword,
  getToken,
  genTokenResetPassword,
};
