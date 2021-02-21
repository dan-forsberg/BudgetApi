"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultEntry = void 0;
var sequelize_1 = require("sequelize");
var sql_1 = require("../sql");
var category_1 = require("./category");
var DefaultEntry = sql_1.MariaDB.define("DefaultEntry", {
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
});
exports.DefaultEntry = DefaultEntry;
DefaultEntry.belongsTo(category_1.Category);
