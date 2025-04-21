const BaseController = require("../../../core/baseController");
const { User, Role, Permission } = require("../associations");
const bcrypt = require("bcryptjs");
const config = require("config");
const Joi = require("joi");
const { Op } = require("sequelize");

class UserController extends BaseController {
  constructor() {
    super(User);
  }

  // ✅ دریافت تمام کاربران
  async getAll(req, res) {
    try {
      console.log("Starting getAll method...");
      const users = await User.findAll({
        include: [{
          model: Role,
          as: "role",
          include: [{
            model: Permission,
            as: "permissions",
            through: { attributes: [] }
          }]
        }]
      });
      console.log("✅ Users found successfully");
      return this.response(res, 200, true, "لیست کاربران دریافت شد.", users);
    } catch (error) {
      console.error("❌ Error in getAll:", error);
      return this.response(
        res,
        500,
        false,
        error.message || "خطا در دریافت داده‌ها",
        null,
        error
      );
    }
  }

  // ✅ دریافت یک کاربر بر اساس ID
  async getOne(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [{
          model: Role,
          as: "role",
          include: [{
            model: Permission,
            as: "permissions",
            through: { attributes: [] }
          }]
        }]
      });
      
      if (!user) {
        console.warn("⚠️ User not found:", req.params.id);
        return this.response(res, 404, false, "کاربر یافت نشد.");
      }

      console.log("✅ User retrieved successfully:", req.params.id);
      return this.response(res, 200, true, "کاربر دریافت شد.", user);
    } catch (error) {
      console.error("❌ Error in getOne:", error);
      return this.response(res, 500, false, "خطا در دریافت داده", null, error);
    }
  }

  // ✅ ایجاد یک کاربر جدید
  async create(req, res) {
    try {
      const {
        firstName,
        lastName,
        email,
        mobile,
        phone,
        username,
        password,
        roleId,
        avatar,
      } = req.body;

      // اعتبارسنجی ورودی‌ها
      const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        mobile: Joi.string()
          .pattern(/^[0-9]{11}$/)
          .optional(),
        phone: Joi.string().optional(),
        username: Joi.string().optional(),
        password: Joi.string().min(6).required(),
        roleId: Joi.number().required(),
        avatar: Joi.string().optional(),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        console.warn("⚠️ Validation error:", error.details[0].message);
        return this.response(res, 400, false, error.details[0].message);
      }

      // چک کردن تکراری بودن ایمیل یا موبایل
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email: value.email }, { mobile: value.mobile }],
        },
      });

      if (existingUser) {
        console.warn("⚠️ Duplicate user attempt:", value.email);
        return this.response(
          res,
          400,
          false,
          "ایمیل یا موبایل قبلاً ثبت شده است."
        );
      }

      // ایجاد کاربر جدید
      const newUser = await User.create({
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        mobile: value.mobile || null,
        phone: value.phone || null,
        username: value.username || null,
        password: value.password,
        roleId: value.roleId,
        avatar: value.avatar || null,
      });

      console.log("✅ User created successfully:", newUser.id);
      return this.response(res, 201, true, "کاربر جدید ایجاد شد.", newUser);
    } catch (error) {
      console.error("❌ Error in create:", error);
      return this.response(res, 500, false, "خطا در ایجاد کاربر", null, error);
    }
  }

  // ✅ ویرایش یک کاربر
  async update(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        console.warn("⚠️ User not found for update:", req.params.id);
        return this.response(res, 404, false, "کاربر یافت نشد.");
      }

      const {
        firstName,
        lastName,
        email,
        mobile,
        phone,
        username,
        password,
        roleId,
        avatar,
      } = req.body;

      // بروزرسانی اطلاعات کاربر
      const updates = {
        firstName: firstName ?? user.firstName,
        lastName: lastName ?? user.lastName,
        email: email ?? user.email,
        mobile: mobile ?? user.mobile,
        phone: phone ?? user.phone,
        username: username ?? user.username,
        roleId: roleId ?? user.roleId,
        avatar: avatar ?? user.avatar,
      };

      if (password) {
        updates.password = password;
      }

      // بروزرسانی اطلاعات کاربر
      await user.update(updates);

      console.log("✅ User updated successfully:", user.id);
      return this.response(res, 200, true, "کاربر بروزرسانی شد.", user);
    } catch (error) {
      console.error("❌ Error in update:", error);
      return this.response(
        res,
        500,
        false,
        "خطا در بروزرسانی کاربر",
        null,
        error
      );
    }
  }

  // ✅ حذف یک کاربر
  async delete(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        console.warn("⚠️ User not found for deletion:", req.params.id);
        return this.response(res, 404, false, "کاربر یافت نشد.");
      }

      await user.destroy();
      console.log("✅ User deleted successfully:", req.params.id);
      return this.response(res, 200, true, "کاربر حذف شد.");
    } catch (error) {
      console.error("❌ Error in delete:", error);
      return this.response(res, 500, false, "خطا در حذف کاربر", null, error);
    }
  }

  // ✅ جستجوی کاربران
  async search(req, res) {
    try {
      const { query } = req.query;
      const users = await User.findAll({
        where: {
          [Op.or]: [
            { firstName: { [Op.like]: `%${query}%` } },
            { lastName: { [Op.like]: `%${query}%` } },
            { email: { [Op.like]: `%${query}%` } },
            { mobile: { [Op.like]: `%${query}%` } },
          ],
        },
        include: [{
          model: Role,
          as: "role",
          include: [{
            model: Permission,
            as: "permissions",
            through: { attributes: [] }
          }]
        }]
      });

      console.log("✅ Users searched successfully with query:", query);
      return this.response(res, 200, true, "جستجو با موفقیت انجام شد.", users);
    } catch (error) {
      console.error("❌ Error in search:", error);
      return this.response(res, 500, false, "خطا در جستجوی کاربران", null, error);
    }
  }
}

module.exports = new UserController();
