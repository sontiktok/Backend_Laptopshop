const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../configs/config");
const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};
const checkPassword = (inputPass, currentPass) => {
  return bcrypt.compareSync(inputPass, currentPass);
};
const getToken = (userId) => {
  const token = jwt.sign({ id: userId }, config.JWT_SECRET_KEY, {
    expiresIn: config.JWT_EXP_IN,
  });
  return token;
};
module.exports = {
  hashPassword,
  checkPassword,
  getToken,
};
