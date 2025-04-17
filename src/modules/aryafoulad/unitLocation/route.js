const express = require('express');
const controller = require('./controller');

const router = express.Router();

// تعریف مسیرها
router.get('/', controller.getAll.bind(controller));
router.get('/default', controller.getDefault.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/create', controller.create.bind(controller));
router.put('/update/:id', controller.update.bind(controller));
router.delete('/delete/:id', controller.delete.bind(controller));

module.exports = router; 