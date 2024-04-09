const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authentication = require("../middlewares/authentication");
const { hashPassword, checkPassword, getToken } = require("../helper/auth");
const { validationResult } = require("express-validator");
const validator = require("../validators/auth");
// Register
router.post("/register", validator(), async function (req, res, next) {
  const checkValidate = validationResult(req);
  console.log("Checkkk-------", checkValidate);
  if (checkValidate.errors.length > 0) {
    return res.status(401).json({
      success: false,
      massage: checkValidate.errors,
    });
  }
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    res.status(409).json({
      success: false,
      message: "Username, password or email invalid!",
    });
    return;
  }
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
    res.status(409).json({
      success: false,
      message: "Username or email is already existed!",
    });
    return;
  }

  try {
    await User.create({
      username,
      password: hashPassword(password),
      email,
    });
    res.status(201).json({
      success: true,
      message: "Register sucessfully",
    });
  } catch (error) {
    res.status(404).json(error);
  }
});

//Login
router.post("/login", async function (req, res, next) {
  const { username, password } = req.body;
  //Lay ra user
  const user = await User.findOne({
    where: {
      username,
    },
  });
  if (!user) {
    return res.status(401).json({
      success: false,
      massage: "Username or password incorrect!",
    });
  }
  //Kiem tra password
  const checkPass = checkPassword(password, user.password);
  if (!checkPass) {
    return res.status(401).json({
      success: false,
      massage: "Username or password incorrect!",
    });
  }
  //hop le
  const token = getToken(user.id);
  return res.status(200).json({
    success: true,
    massage: "Login successfuly",
    token: token,
  });
});
router.get("/me", authentication, async function (req, res, next) {
  res.status(201).json({
    success: true,
    data: req.user,
  });
});
module.exports = router;
