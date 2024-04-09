const { where } = require("sequelize");
const Role = require("../models/Role");
module.exports = function (...roles) {
  return async function (req, res, next) {
    let requiredRole = roles.map((e) => e.toLowerCase());
    const roleId = req.user.roleId;
    const roleUser = await Role.findOne({
      where: {
        id: roleId,
      },
    });
    const roleName = roleUser.name;
    // let roleOfUser = req.user.role.map((e) => e.toLowerCase());
    // let result = requiredRole.filter((e) => roleOfUser.includes(e));
    let result = requiredRole.includes(roleName.toLowerCase());
    if (result) {
      next();
    } else {
      res.status(403).json({
        success: false,
        massage: "Unauthorized!",
      });
    }
  };
};
