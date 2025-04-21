const express = require("express");
const router = express.Router();

// Import routes
const userRouter = require("./user/route");
const roleRouter = require("./role/route");
const permissionRouter = require("./permission/route");
const authRouter = require("./auth/route");

// Define routes
router.use("/auth", authRouter); // احراز هویت
router.use("/user", userRouter); // مدیریت کاربر
router.use("/role", roleRouter); // مدیریت نقش
router.use("/permission", permissionRouter); // مدیریت دسترسی


module.exports = router; 