const Joi = require("joi");
const nameProduct = Joi.string().required().label("Tên sản phẩm");
const descProduct = Joi.string().required().label("Mô tả sản phẩm");
const priceProduct = Joi.number().positive().required().label("Giá sản phẩm");
const quantity = Joi.number().integer().min(0).required().label("Số lượng");
const brandId = Joi.number()
  .integer()
  .positive()
  .required()
  .label("ID thương hiệu");

//Create Brand
const createProduct = Joi.object({
  name: nameProduct,
  description: descProduct,
  price: priceProduct,
  quantity: quantity,
  brandId: brandId,
});

const updateProduct = Joi.object({
  description: descProduct,
  price: priceProduct,
  quantity: quantity,
});
module.exports = {
  createProduct,
  updateProduct,
};
