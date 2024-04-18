const Role = require("./Role");
const User = require("./User");
const Comment = require("./Comment");
const Order = require("./Order");
const Product = require("./Product");
const Brand = require("./Brand");
const OrderProduct = require("./OrderProduct");
const Cart = require("./Cart");
//User - Role
User.belongsTo(Role, { foreignKey: "roleId" });
Role.hasMany(User, { foreignKey: "roleId" });
//User - Comment
User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });
//User - Order
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });
//Product - Comment
Product.hasMany(Comment, { foreignKey: "productId" });
Comment.belongsTo(Product, { foreignKey: "productId" });
//Product - Brand
Product.belongsTo(Brand, { foreignKey: "brandId" });
Brand.hasMany(Product, { foreignKey: "brandId" });
//Order - Product
Order.belongsToMany(Product, {
  through: OrderProduct,
});
Product.belongsToMany(Order, {
  through: OrderProduct,
});
