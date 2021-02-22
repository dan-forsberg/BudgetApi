"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sql = {
    database: "economy",
    username: process.env.dbUser || "economy",
    password: process.env.dbPassword || "economy",
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
