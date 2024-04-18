const Joi = require("joi");
const fullName = Joi.string().required();
const address = Joi.string().required();
const phone = Joi.string()
  .length(10)
  .pattern(/^[0-9]+$/);

const updateUser = Joi.object({
  fullName,
  address,
  phone,
});

module.exports = {
  updateUser,
};
