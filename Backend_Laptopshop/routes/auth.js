const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authentication = require("../middlewares/authentication");
const {
    hashPassword,
    checkPassword,
    getToken,
    genTokenResetPassword,
} = require("../helper/auth");
const sendMail = require("../helper/sendMail");
const { where } = require("sequelize");
const validator = require("../middlewares/validator");
const authSchema = require("../validations/authSchema");
const Res = require("../helper/response");
// Register
router.post(
    "/register",
    validator(authSchema.registerSchema),
    async function (req, res, next) {
        const { username, password, email } = req.body;
        const checkUsername = await User.findOne({
            where: {
                username,
            },
        });
        const checkEmail = await User.findOne({
            where: {
                email,
            },
        });
        if (checkUsername || checkEmail) {
            return Res(
                res,
                409,
                false,
                null,
                "Username or email is already existed!"
            );
        }
        try {
            const user = await User.create({
                username,
                password: hashPassword(password),
                email,
                roleId: 2,
            });
            return Res(res, 201, true, user, "Register sucessfully");
        } catch (error) {
            return Res(res, 404, false, null, error);
        }
    }
);
//Login
router.post(
    "/login",
    validator(authSchema.loginSchema),
    async function (req, res, next) {
        const { username, password } = req.body;
        //Lay ra user
        const user = await User.findOne({
            where: {
                username,
            },
        });
        if (!user) {
            return Res(res, 401, false, null, "Username or password incorrect!");
        }
        //Kiem tra password
        const checkPass = checkPassword(password, user.password);
        if (!checkPass) {
            return Res(res, 401, false, null, "Username or password incorrect!");
        }
        //hop le
        const token = getToken(user.id);
        return res
            .status(200)
            .cookie("token", token, {
                expires: new Date(Date.now() + 24 * 3600 * 1000),
                httpOnly: true,
            })
            .json({
                success: true,
                massage: "Login successfuly",
                token: token,
            });
    }
);
router.get("/me", authentication, async function (req, res, next) {
    Res(res, 200, true, req.user, "Get your info successfully!");
});
//Forgot password
router.post(
    "/ForgotPassword",
    validator(authSchema.forgotPwSchema),
    async function (req, res, next) {
        const user = await User.findOne({
            where: {
                email: req.body.email,
            },
        });
        if (!user) {
            return Res(res, 404, false, null, "Email not found.");
        }
        let token = await genTokenResetPassword(user.id);
        let url = `http://localhost:3000/auth/ResetPassword/${token}`;
        try {
            await sendMail(user.email, url);
            return Res(
                res,
                200,
                true,
                null,
                "We send a link reset password to your email, Please check mail and change password!"
            );
        } catch (error) {
            return Res(res, 500, false, null, error);
        }
    }
);
//Reset password
router.post(
    "/ResetPassword/:token",
    validator(authSchema.resetPwSchema),
    async function (req, res, next) {
        const { token } = req.params;
        const { newPassword } = req.body;
        try {
            const user = await User.findOne({
                where: {
                    ResetPasswordToken: token,
                },
            });
            if (!user) {
                return Res(res, 404, false, null, "Incorrect token!");
            }
            await User.update(
                {
                    password: hashPassword(newPassword),
                    ResetPasswordToken: null,
                    ResetPasswordExp: null,
                },
                {
                    where: {
                        id: user.id,
                    },
                }
            );
            return Res(
                res,
                200,
                true,
                null,
                "Your password has been updated successfully!"
            );
        } catch (error) {
            console.error(error);
            return Res(
                res,
                500,
                false,
                null,
                "An error occurred while updating your password."
            );
        }
    }
);

//Change password
router.post(
    "/changePassword",
    authentication,
    validator(authSchema.changePwSchema),
    async function (req, res, next) {
        const { oldPassword, newPassword } = req.body;
        const user = req.user;
        const checkPass = checkPassword(oldPassword, user.password);
        if (!checkPass) {
            Res(res, 404, false, null, "Incorrect password!");
        }
        try {
            await User.update(
                { password: hashPassword(newPassword) },
                {
                    where: { id: user.id },
                }
            );
            Res(res, 200, true, null, "Change password successfully");
        } catch (error) {
            Res(res, 500, false, null, "Change password have error");
        }
    }
);

module.exports = router;
