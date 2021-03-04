"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sql = {
    database: process.env.DB_NAME || "economy",
    username: process.env.DB_USER || "economy",
    password: process.env.DB_PASSWD || "economy",
    host: process.env.DB_HOST || "0.0.0.0",
    port: process.env.DB_PORT || 3306,
    logging: process.env.DB_LOGGING !== undefined,
    dialect: "mariadb"
};
var SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "0.0.0.0";
var SERVER_HTTP_PORT = process.env.SERVER_HTTP_PORT || 8080;
var SERVER = {
    hostname: SERVER_HOSTNAME,
    httpPort: SERVER_HTTP_PORT
};
var config = {
    sql: sql,
    server: SERVER
};
exports.default = config;
