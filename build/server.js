"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var https_1 = __importDefault(require("https"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var fs_1 = __importDefault(require("fs"));
var express_openid_connect_1 = require("express-openid-connect");
var logging_1 = __importDefault(require("./config/logging"));
var config_1 = __importDefault(require("./config/config"));
var entry_1 = __importDefault(require("./routes/entry"));
var category_1 = __importDefault(require("./routes/category"));
var defaultEntry_1 = __importDefault(require("./routes/defaultEntry"));
var sql_1 = require("./sql");
var entry_2 = require("./models/entry");
var category_2 = require("./models/category");
var defaultEntry_2 = require("./models/defaultEntry");
var NAMESPACE = "Server";
var router = express_1.default();
var privateKey = fs_1.default.readFileSync("/etc/letsencrypt/live/dasifor.xyz/privkey.pem", "utf8");
var certificate = fs_1.default.readFileSync("/etc/letsencrypt/live/dasifor.xyz//cert.pem", "utf8");
var ca = fs_1.default.readFileSync("/etc/letsencrypt/live/dasifor.xyz//chain.pem", "utf8");
var credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};
var authConfig = {
    authRequired: false,
    auth0Logout: true,
    secret: "a long, randomly-generated string stored in env",
    baseURL: "https://dasifor.xyz",
    clientID: "5qQ5xvpUl4gecTkaP95O1HpKhGoJMUD0",
    issuerBaseURL: "https://dev-dasifor.eu.auth0.com"
};
/** Connect to MariaDB */
sql_1.MariaDB.authenticate().then(function () {
    logging_1.default.info(NAMESPACE, "MariaDB connected successfully!");
    category_2.Category.sync().then(function () {
        entry_2.Entry.sync();
        defaultEntry_2.DefaultEntry.sync();
    });
});
/** Do not catch, let the server crash and burn terribly. */
/** Authentication */
router.use(express_openid_connect_1.auth(authConfig));
/** Log the request */
router.use(function (req, res, next) {
    /** Log the req */
    logging_1.default.info(NAMESPACE, "METHOD: [" + req.method + "] - URL: [" + req.url + "] - IP: [" + req.socket.remoteAddress + "]");
    res.on("finish", function () {
        /** Log the res */
        logging_1.default.info(NAMESPACE, "METHOD: [" + req.method + "] - URL: [" + req.url + "] - STATUS: [" + res.statusCode + "] - IP: [" + req.socket.remoteAddress + "]");
    });
    next();
});
router.use(cors_1.default());
/** Parse the body of the request */
router.use(express_1.default.urlencoded({ extended: true }));
router.use(express_1.default.json());
/** Rules of our API */
router.use("/api", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method == "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});
/** Routes go here */
router.use("/api/entry", express_openid_connect_1.requiresAuth(), entry_1.default);
router.use("/api/category", express_openid_connect_1.requiresAuth(), category_1.default);
router.use("/api/default", express_openid_connect_1.requiresAuth(), defaultEntry_1.default);
/** Static files */
router.use("/", express_1.default.static("www"));
/** Error handling */
router.use("*", function (_, res) {
    var error = new Error("Not found");
    res.status(404).json({
        message: error.message
    });
});
var httpsServer = https_1.default.createServer(credentials, router);
httpsServer.listen(config_1.default.server.port, function () { return logging_1.default.info(NAMESPACE, "Server is running https://" + config_1.default.server.hostname + ":" + config_1.default.server.port); });
