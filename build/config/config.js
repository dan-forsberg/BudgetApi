"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var sql = {
    database: "economy",
    username: "economy",
    password: "economy",
    host: "localhost",
    port: 3306,
    dialect: "mariadb",
    logging: false,
};
var SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "0.0.0.0";
var SERVER_PORT = process.env.SERVER_PORT || 8080;
var SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};
var config = {
    sql: sql,
    server: SERVER
};
exports.default = config;
