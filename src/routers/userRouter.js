const express = require("express");
const {
  getUserByIdController,
  getUserListController,
  loginController,
  signupController,
  sendCodeController,
  getIpAddressController,
  updateUserInfoController,
  getAdminController,
  setUserFreezeController
} = require("../controller/userController");
const { check, validationResult } = require("express-validator");
const auth = require('../middleware/auth');

const userRouter = express.Router();

userRouter.get("/", [check("uid")], getUserByIdController);
userRouter.post("/list", getUserListController);
userRouter.get("/info", getUserByIdController);
userRouter.get("/admin/info", getAdminController);
userRouter.put("/freeze", auth, setUserFreezeController);
userRouter.post("/login",auth, [check("name"), check("password")], loginController);

userRouter.post(
  "/signup",
  [check("name").isLength({ min: 2 }), check("password").isLength({ min: 4 })],
  signupController
);

userRouter.all("/sendCode", sendCodeController);
userRouter.get("/getIpInfo", getIpAddressController);
//  更新
userRouter.put("/put", updateUserInfoController);
module.exports = userRouter;
