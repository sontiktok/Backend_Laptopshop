const Joi = require("joi");
const quantity = Joi.number().integer().min(0).required().label("Số lượng");
const productId = Joi.number().required();
//Create Brand
const createOrder = Joi.object({
  quantity,
  productId,
});

module.exports = {
  createOrder,
};
