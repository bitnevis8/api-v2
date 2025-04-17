const User = require("./user/model");
const Role = require("./role/model");
const Permission = require("./permission/model");
const { DataTypes } = require("sequelize");
const sequelize = require("../../core/database/mysql/connection");

// تعریف جدول ارتباطی بین Role و Permission
const RolePermission = sequelize.define(
  "RolePermission",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    roleId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: {
        model: Role,
        key: "id"
      },
      validate: {
        notNull: { msg: "نقش نمی‌تواند خالی باشد" }
      }
    },
    permissionId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: {
        model: Permission,
        key: "id"
      }
    }
  },
  {
    tableName: "role_permissions",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["roleId", "permissionId"]
      },
      {
        fields: ["roleId"]
      },
      {
        fields: ["permissionId"]
      }
    ]
  }
);

// ارتباط User و Role (One-to-Many)
User.belongsTo(Role, { 
  foreignKey: "roleId", 
  as: "role",
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
Role.hasMany(User, { foreignKey: "roleId", as: "users" });

// ارتباط Role و Permission (Many-to-Many)
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "roleId",
  otherKey: "permissionId",
  as: "permissions"
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permissionId",
  otherKey: "roleId",
  as: "roles"
});

module.exports = {
  User,
  Role,
  Permission,
  RolePermission
}; 