const baseController = require('../../../core/baseController');
const RateSetting = require('./model');
const { Op } = require('sequelize');

class RateSettingController extends baseController {
    constructor() {
        super();
    }

    async getAll(req, res) {
        try {
            const rateSettings = await RateSetting.findAll({
                order: [['createdAt', 'DESC']]
            });
            return this.response(res, 200, true, 'لیست نرخ‌ها با موفقیت دریافت شد', rateSettings);
        } catch (error) {
            console.error('Error in getAll:', error);
            return this.response(res, 500, false, 'خطا در دریافت لیست نرخ‌ها', null, error.message);
        }
    }

    async getActive(req, res) {
        try {
            const activeRate = await RateSetting.findOne({
                where: { isActive: true }
            });
            return this.response(res, 200, true, 'نرخ فعال با موفقیت دریافت شد', activeRate);
        } catch (error) {
            console.error('Error in getActive:', error);
            return this.response(res, 500, false, 'خطا در دریافت نرخ فعال', null, error.message);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const rate = await RateSetting.findByPk(id);
            if (!rate) {
                return this.response(res, 404, false, 'نرخ مورد نظر یافت نشد');
            }
            return this.response(res, 200, true, 'نرخ با موفقیت دریافت شد', rate);
        } catch (error) {
            console.error('Error in getById:', error);
            return this.response(res, 500, false, 'خطا در دریافت نرخ', null, error.message);
        }
    }

    async create(req, res) {
        try {
            const { ratePerKm, description } = req.body;
            
            // غیرفعال کردن نرخ‌های قبلی
            await RateSetting.update(
                { isActive: false },
                { where: { isActive: true } }
            );

            const newRate = await RateSetting.create({
                ratePerKm,
                description,
                isActive: true,
                createdBy: req.user?.id
            });

            return this.response(res, 201, true, 'نرخ جدید با موفقیت ایجاد شد', newRate);
        } catch (error) {
            console.error('Error in create:', error);
            return this.response(res, 500, false, 'خطا در ایجاد نرخ جدید', null, error.message);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { ratePerKm, description, isActive } = req.body;

            const rate = await RateSetting.findByPk(id);
            if (!rate) {
                return this.response(res, 404, false, 'نرخ مورد نظر یافت نشد');
            }

            // اگر نرخ جدید فعال شود، بقیه را غیرفعال می‌کنیم
            if (isActive) {
                await RateSetting.update(
                    { isActive: false },
                    { where: { isActive: true, id: { [Op.ne]: id } } }
                );
            }

            await rate.update({
                ratePerKm,
                description,
                isActive,
                updatedBy: req.user?.id
            });

            return this.response(res, 200, true, 'نرخ با موفقیت به‌روزرسانی شد', rate);
        } catch (error) {
            console.error('Error in update:', error);
            return this.response(res, 500, false, 'خطا در به‌روزرسانی نرخ', null, error.message);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const rate = await RateSetting.findByPk(id);
            if (!rate) {
                return this.response(res, 404, false, 'نرخ مورد نظر یافت نشد');
            }

            // اگر نرخ فعال است، نمی‌توانیم آن را حذف کنیم
            if (rate.isActive) {
                return this.response(res, 400, false, 'نمی‌توان نرخ فعال را حذف کرد');
            }

            await rate.destroy();
            return this.response(res, 200, true, 'نرخ با موفقیت حذف شد');
        } catch (error) {
            console.error('Error in delete:', error);
            return this.response(res, 500, false, 'خطا در حذف نرخ', null, error.message);
        }
    }
}

module.exports = new RateSettingController(); 