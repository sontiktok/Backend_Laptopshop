let { check } = require("express-validator");
let util = require("node:util");

let options = {
  password: {
    minLength: 8,
    minLowercase: 1,
    minSymbols: 1,
    minUppercase: 1,
    minNumbers: 1,
  },
  username: {
    min: 8,
    max: 42,
  },
};

let Notifies = {
  EMAIL: "email phai dung dinh dang",
  PASSWORD:
    "Password must be at least %d characters long, include at least %d uppercase letter, %d lowercase letter, %d symbol, %d number",
  USERNAME: "Username must be %d to %d characters long",
  ROLE: "Invalid role",
};

module.exports = function () {
  return [
    check("email", Notifies.EMAIL).isEmail(),
    check(
      "password",
      util.format(
        Notifies.PASSWORD,
        options.password.minLength,
        options.password.minUppercase,
        options.password.minLowercase,
        options.password.minSymbols,
        options.password.minNumbers
      )
    ).isStrongPassword(options.password),
    check(
      "username",
      util.format(Notifies.USERNAME, options.username.min, options.username.max)
    ).isLength(options.username),
  ];
};
