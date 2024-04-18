const jwt = require("jsonwebtoken");
const config = require("../configs/config");
const User = require("../models/User");
const { where } = require("sequelize");

module.exports = async function (req, res, next) {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else {
        if (req.cookies.token) {
            token = req.cookies.token;
        }
    }
    if (!token) {
        return res.status(403).json({
            success: false,
            massage: "Unauthorized",
        });
    }
    try {
        let result = jwt.verify(token, config.JWT_SECRET_KEY);
        if (result.exp * 1000 > Date.now()) {
            const user = await User.findOne({
                where: {
                    id: result.id,
                },
            });
            req.user = user;
            next();
        } else {
            return res.status(403).json({
                success: false,
                massage: "Unauthorized",
            });
        }
    } catch (error) {
        return res.status(403).json({
            success: false,
            massage: "Unauthorized",
        });
    }
};
