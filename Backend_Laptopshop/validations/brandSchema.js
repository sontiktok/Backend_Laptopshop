const Joi = require("joi");
const nameBrand = Joi.string().required();
const descBrand = Joi.string().required();
//Create Brand
const createBrand = Joi.object({
  name: nameBrand,
  desc: descBrand,
});

const updateBrand = Joi.object({
  newDesc: descBrand,
});
module.exports = {
  createBrand,
  updateBrand,
};
