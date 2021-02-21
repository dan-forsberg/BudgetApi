"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MariaDB = void 0;
var sequelize_1 = require("sequelize");
var config_1 = __importDefault(require("./config/config"));
exports.MariaDB = new sequelize_1.Sequelize(config_1.default.sql.database, config_1.default.sql.username, config_1.default.sql.password, {
    host: config_1.default.sql.host,
    dialect: "mariadb",
    logging: config_1.default.sql.logging
});
