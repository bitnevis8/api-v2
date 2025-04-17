const express = require('express');
const MissionOrderController = require('./controller');

const router = express.Router();

// تعریف مسیرها
router.get('/getAll', MissionOrderController.getAll); // دریافت تمام حکم‌های ماموریت
router.get('/getOne/:id', MissionOrderController.getById); // دریافت یک حکم ماموریت بر اساس ID
router.post('/create', MissionOrderController.create); // ایجاد حکم ماموریت جدید
router.put('/update/:id', MissionOrderController.update); // ویرایش حکم ماموریت بر اساس ID
router.delete('/delete/:id', MissionOrderController.delete); // حذف حکم ماموریت بر اساس ID

module.exports = router; 