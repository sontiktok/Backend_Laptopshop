const Joi = require("joi");
const pwSchema = Joi.string().min(6).required();
const emailSchema = Joi.string().email().required();
const usernameSchema = Joi.string().min(3).required();

//Register
const registerSchema = Joi.object({
  username: usernameSchema,
  email: emailSchema,
  password: pwSchema,
});

//Login
const loginSchema = Joi.object({
  username: usernameSchema,
  password: pwSchema,
});

//Forgot password
const forgotPwSchema = Joi.object({
  email: emailSchema,
});
//Reset password
const resetPwSchema = Joi.object({
  newPassword: pwSchema,
});
//Change password
const changePwSchema = Joi.object({
  newPassword: pwSchema,
});
module.exports = {
  registerSchema,
  loginSchema,
  pwSchema,
  emailSchema,
  forgotPwSchema,
  resetPwSchema,
  changePwSchema,
};
