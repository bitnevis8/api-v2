const { DataTypes } = require('sequelize');
const sequelize = require('../../../core/database/mysql/connection');

const UnitLocation = sequelize.define('UnitLocation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: { 
        type: DataTypes.STRING,
        allowNull: false
    },
    latitude: { 
        type: DataTypes.FLOAT,
        allowNull: false
    },
    longitude: { 
        type: DataTypes.FLOAT,
        allowNull: false
    },
    isDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'unit_locations',
    timestamps: true
});

module.exports = UnitLocation; 