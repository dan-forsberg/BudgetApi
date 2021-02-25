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
var SERVER_HTTPS_PORT = process.env.SERVER_HTTPS_PORT || 4433;
var SERVER_HTTP_PORT = process.env.SERVER_HTTP_PORT || 8080;
var SERVER = {
    hostname: SERVER_HOSTNAME,
    httpsPort: SERVER_HTTPS_PORT,
    httpPort: SERVER_HTTP_PORT
};
var config = {
    sql: sql,
    server: SERVER
};
exports.default = config;
