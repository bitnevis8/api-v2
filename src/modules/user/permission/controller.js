const BaseController = require("../../../core/baseController");
const Permission = require("./model");
const Role = require("../role/model");

class PermissionController extends BaseController {
  constructor() {
    super(Permission);
  }

  // ✅ دریافت تمام دسترسی‌ها
  async getAll(req, res) {
    try {
      const permissions = await Permission.findAll({
        include: [{
          model: Role,
          as: "permissionRoles",
          through: { attributes: [] }
        }]
      });
      return this.response(res, 200, true, "لیست دسترسی‌ها دریافت شد.", permissions);
    } catch (error) {
      return this.response(res, 500, false, "خطا در دریافت داده‌ها", null, error);
    }
  }

  // ✅ دریافت یک دسترسی با ID
  async getOne(req, res) {
    try {
      const permission = await Permission.findByPk(req.params.id, {
        include: [{
          model: Role,
          as: "permissionRoles",
          through: { attributes: [] }
        }]
      });
      if (!permission) {
        return this.response(res, 404, false, "دسترسی یافت نشد.");
      }
      return this.response(res, 200, true, "دسترسی دریافت شد.", permission);
    } catch (error) {
      return this.response(res, 500, false, "خطا در دریافت داده", null, error);
    }
  }

  // ✅ دریافت دسترسی با ماژول
  async getByModule(req, res) {
    try {
      const permissions = await Permission.findAll({
        where: { module: req.params.module },
        include: [{
          model: Role,
          as: "permissionRoles",
          through: { attributes: [] }
        }]
      });
      return this.response(res, 200, true, "دسترسی‌های ماژول دریافت شد.", permissions);
    } catch (error) {
      return this.response(res, 500, false, "خطا در دریافت داده‌ها", null, error);
    }
  }

  // ✅ ایجاد دسترسی جدید
  async create(req, res) {
    try {
      const permission = await Permission.create(req.body);
      return this.response(res, 201, true, "دسترسی جدید ایجاد شد.", permission);
    } catch (error) {
      return this.response(res, 500, false, "خطا در ایجاد دسترسی", null, error);
    }
  }

  // ✅ به‌روزرسانی دسترسی
  async update(req, res) {
    try {
      const permission = await Permission.findByPk(req.params.id);
      if (!permission) {
        return this.response(res, 404, false, "دسترسی یافت نشد.");
      }
      await permission.update(req.body);
      return this.response(res, 200, true, "دسترسی به‌روزرسانی شد.", permission);
    } catch (error) {
      return this.response(res, 500, false, "خطا در به‌روزرسانی دسترسی", null, error);
    }
  }

  // ✅ حذف دسترسی
  async delete(req, res) {
    try {
      const permission = await Permission.findByPk(req.params.id);
      if (!permission) {
        return this.response(res, 404, false, "دسترسی یافت نشد.");
      }
      await permission.destroy();
      return this.response(res, 200, true, "دسترسی حذف شد.");
    } catch (error) {
      return this.response(res, 500, false, "خطا در حذف دسترسی", null, error);
    }
  }
}

module.exports = new PermissionController(); 