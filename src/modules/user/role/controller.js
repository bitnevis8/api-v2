const BaseController = require("../../../core/baseController");
const Role = require("./model");
const Permission = require("../permission/model");

class RoleController extends BaseController {
  constructor() {
    super(Role);
  }

  // ✅ دریافت تمام نقش‌ها به همراه دسترسی‌هایشان
  async getAll(req, res) {
    try {
      const roles = await Role.findAll({
        include: [{
          model: Permission,
          as: "rolePermissions",
          through: { attributes: [] }
        }]
      });
      return this.response(res, 200, true, "لیست نقش‌ها دریافت شد.", roles);
    } catch (error) {
      return this.response(res, 500, false, "خطا در دریافت داده‌ها", null, error);
    }
  }

  // ✅ دریافت یک نقش با ID
  async getOne(req, res) {
    try {
      const role = await Role.findByPk(req.params.id, {
        include: [{
          model: Permission,
          as: "rolePermissions",
          through: { attributes: [] }
        }]
      });
      if (!role) {
        return this.response(res, 404, false, "نقش یافت نشد.");
      }
      return this.response(res, 200, true, "نقش دریافت شد.", role);
    } catch (error) {
      return this.response(res, 500, false, "خطا در دریافت داده", null, error);
    }
  }

  // ✅ ایجاد نقش جدید
  async create(req, res) {
    try {
      const { name, nameEn, nameFa, permissions } = req.body;
      const role = await Role.create({ name, nameEn, nameFa });
      
      if (permissions && permissions.length > 0) {
        await role.setRolePermissions(permissions);
      }

      const roleWithPermissions = await Role.findByPk(role.id, {
        include: [{
          model: Permission,
          as: "rolePermissions",
          through: { attributes: [] }
        }]
      });

      return this.response(res, 201, true, "نقش جدید ایجاد شد.", roleWithPermissions);
    } catch (error) {
      return this.response(res, 500, false, "خطا در ایجاد نقش", null, error);
    }
  }

  // ✅ به‌روزرسانی نقش
  async update(req, res) {
    try {
      const { name, nameEn, nameFa, permissions } = req.body;
      const role = await Role.findByPk(req.params.id);
      
      if (!role) {
        return this.response(res, 404, false, "نقش یافت نشد.");
      }

      await role.update({ name, nameEn, nameFa });
      
      if (permissions) {
        await role.setRolePermissions(permissions);
      }

      const updatedRole = await Role.findByPk(role.id, {
        include: [{
          model: Permission,
          as: "rolePermissions",
          through: { attributes: [] }
        }]
      });

      return this.response(res, 200, true, "نقش به‌روزرسانی شد.", updatedRole);
    } catch (error) {
      return this.response(res, 500, false, "خطا در به‌روزرسانی نقش", null, error);
    }
  }

  // ✅ حذف نقش
  async delete(req, res) {
    try {
      const role = await Role.findByPk(req.params.id);
      if (!role) {
        return this.response(res, 404, false, "نقش یافت نشد.");
      }
      await role.destroy();
      return this.response(res, 200, true, "نقش حذف شد.");
    } catch (error) {
      return this.response(res, 500, false, "خطا در حذف نقش", null, error);
    }
  }
}

module.exports = new RoleController(); 