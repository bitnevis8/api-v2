const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../../core/database/mysql/connection");

class Permission extends Model {}
Permission.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING, allowNull: true },
    module: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "Permission",
    tableName: "permissions",
    timestamps: true,
    underscored: true
  }
);

module.exports = Permission; 