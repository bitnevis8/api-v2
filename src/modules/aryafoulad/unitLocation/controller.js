const BaseController = require('../../../core/baseController');
const UnitLocation = require('./model');

class UnitLocationController extends BaseController {
    constructor() {
        super(UnitLocation);
        this.model = UnitLocation;
    }

    async getAll(req, res) {
        try {
            const docs = await this.model.findAll();
            return this.response(res, 200, true, 'تمام واحدها دریافت شدند.', docs);
        } catch (err) {
            return this.response(res, 500, false, 'خطا در دریافت واحدها.', null, err);
        }
    }

    async getById(req, res) {
        try {
            const doc = await this.model.findByPk(req.params.id);
            if (!doc) {
                return this.response(res, 404, false, 'واحد مورد نظر یافت نشد.');
            }
            return this.response(res, 200, true, 'واحد با موفقیت دریافت شد.', doc);
        } catch (err) {
            return this.response(res, 500, false, 'خطا در دریافت واحد.', null, err);
        }
    }

    async create(req, res) {
        try {
            const { name, latitude, longitude, isDefault } = req.body;

            // اگر این واحد به عنوان پیش‌فرض انتخاب شده، بقیه واحدها از حالت پیش‌فرض خارج شوند
            if (isDefault) {
                await this.model.update(
                    { isDefault: false },
                    { where: { isDefault: true } }
                );
            }

            const doc = await this.model.create({
                name,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                isDefault: Boolean(isDefault)
            });

            return this.response(res, 201, true, 'واحد با موفقیت ایجاد شد.', doc);
        } catch (err) {
            return this.response(res, 500, false, 'خطا در ایجاد واحد.', null, err);
        }
    }

    async update(req, res) {
        try {
            const doc = await this.model.findByPk(req.params.id);
            if (!doc) return this.response(res, 404, false, 'واحد یافت نشد.');

            const { name, latitude, longitude, isDefault } = req.body;

            // اگر این واحد به عنوان پیش‌فرض انتخاب شده، بقیه واحدها از حالت پیش‌فرض خارج شوند
            if (isDefault) {
                await this.model.update(
                    { isDefault: false },
                    { where: { isDefault: true } }
                );
            }

            await doc.update({
                name,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                isDefault: Boolean(isDefault)
            });

            return this.response(res, 200, true, 'واحد با موفقیت بروزرسانی شد.', doc);
        } catch (err) {
            return this.response(res, 500, false, 'خطا در بروزرسانی واحد.', null, err);
        }
    }

    async delete(req, res) {
        try {
            const doc = await this.model.findByPk(req.params.id);
            if (!doc) return this.response(res, 404, false, 'واحد یافت نشد.');
            
            // اگر واحد پیش‌فرض است، اجازه حذف ندهید
            if (doc.isDefault) {
                return this.response(res, 400, false, 'واحد پیش‌فرض را نمی‌توان حذف کرد.');
            }

            await doc.destroy();
            return this.response(res, 200, true, 'واحد با موفقیت حذف شد.');
        } catch (err) {
            return this.response(res, 500, false, 'خطا در حذف واحد.', null, err);
        }
    }

    async getDefault(req, res) {
        try {
            const doc = await this.model.findOne({ where: { isDefault: true } });
            if (!doc) {
                return this.response(res, 404, false, 'واحد پیش‌فرض یافت نشد.');
            }
            return this.response(res, 200, true, 'واحد پیش‌فرض دریافت شد.', doc);
        } catch (err) {
            return this.response(res, 500, false, 'خطا در دریافت واحد پیش‌فرض.', null, err);
        }
    }
}

module.exports = new UnitLocationController();