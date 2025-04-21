const express = require('express');
const router = express.Router();
const rateSettingController = require('./controller');

// دریافت لیست همه نرخ‌ها
router.get('/getAll', rateSettingController.getAll);

// دریافت نرخ فعال
router.get('/getActive', rateSettingController.getActive);

// دریافت نرخ با شناسه
router.get('/:id', rateSettingController.getById);

// ایجاد نرخ جدید
router.post('/create', rateSettingController.create);

// به‌روزرسانی نرخ
router.put('/update/:id', rateSettingController.update);

// حذف نرخ
router.delete('/delete/:id', rateSettingController.delete);

module.exports = router; 