const { DataTypes } = require('sequelize');
const sequelize = require('../../../core/database/mysql/connection');

const RateSetting = sequelize.define('RateSetting', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ratePerKm: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 2500,
        comment: 'نرخ به ازای هر کیلومتر'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'وضعیت فعال بودن نرخ'
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'توضیحات نرخ'
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'شناسه کاربر ایجاد کننده'
    },
    updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'شناسه کاربر ویرایش کننده'
    }
}, {
    tableName: 'rate_settings',
    timestamps: true,
    paranoid: true
});

module.exports = RateSetting; 