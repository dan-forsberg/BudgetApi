"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entry = void 0;
var sequelize_1 = require("sequelize");
var sql_1 = require("../sql");
var category_1 = require("./category");
var Entry = sql_1.MariaDB.define("Entry", {
    date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
});
exports.Entry = Entry;
Entry.belongsTo(category_1.Category);
