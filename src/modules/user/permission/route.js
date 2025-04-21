const express = require("express");
const PermissionController = require("./controller");

const router = express.Router();

// روت‌های مربوط به دسترسی‌ها
router.get("/getAll", PermissionController.getAll); // دریافت تمام دسترسی‌ها
router.get("/getOne/:id", PermissionController.getOne); // دریافت یک دسترسی بر اساس ID
router.post("/create", PermissionController.create); // ایجاد دسترسی جدید
router.put("/update/:id", PermissionController.update); // ویرایش دسترسی بر اساس ID
router.delete("/delete/:id", PermissionController.delete); // حذف دسترسی بر اساس ID
router.get("/getByModule/:module", PermissionController.getByModule); // دریافت دسترسی‌های یک ماژول

module.exports = router; 