"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
var sequelize_1 = require("sequelize");
var sql_1 = require("../sql");
var Category = sql_1.MariaDB.define("Category", {
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});
exports.Category = Category;
