"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
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
var production = process.env.NODE_ENV === "production";
sql_1.MariaDB.authenticate().then(function () {
    logging_1.default.info(NAMESPACE, "MariaDB connected successfully!");
    category_2.Category.sync().then(function () {
        entry_2.Entry.sync();
        defaultEntry_2.DefaultEntry.sync();
    });
}).catch(function (err) {
    logging_1.default.error(NAMESPACE, "Could not connect to MariaDB. Exiting.", err.message);
    process.exit(1);
});
if (production) {
    var authConfig = {
        authRequired: false,
        auth0Logout: true,
        secret: process.env.secret,
        baseURL: process.env.baseURL,
        clientID: process.env.clientID,
        issuerBaseURL: process.env.issuerBaseURL
    };
    router.use(express_openid_connect_1.auth(authConfig));
}
router.use(cors_1.default());
/** Log the request */
router.use(function (req, res, next) {
    var remoteIP = req.header("x-forwarded-for");
    logging_1.default.info(NAMESPACE, "METHOD: [" + req.method + "] - URL: [" + req.url + "] - IP: [" + remoteIP + "]");
    res.on("finish", function () {
        logging_1.default.info(NAMESPACE, "METHOD: [" + req.method + "] - URL: [" + req.url + "] - STATUS: [" + res.statusCode + "] - IP: [" + remoteIP + "]");
    });
    next();
});
router.use(express_1.default.urlencoded({ extended: true }));
router.use(express_1.default.json());
router.use("/api", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method == "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});
if (production) {
    /** Routes go here */
    router.use("/api/entry", express_openid_connect_1.requiresAuth(), entry_1.default);
    router.use("/api/category", express_openid_connect_1.requiresAuth(), category_1.default);
    router.use("/api/default", express_openid_connect_1.requiresAuth(), defaultEntry_1.default);
    /** Static files */
    router.use("/", express_openid_connect_1.requiresAuth(), express_1.default.static("build/www"));
    router.use("/edit", express_openid_connect_1.requiresAuth(), express_1.default.static("build/www"));
    router.use("/new", express_openid_connect_1.requiresAuth(), express_1.default.static("build/www"));
}
else {
    router.use("/api/entry", entry_1.default);
    router.use("/api/category", category_1.default);
    router.use("/api/default", defaultEntry_1.default);
    router.use("/", express_1.default.static("build/www"));
    router.use("/edit", express_1.default.static("build/www"));
    router.use("/new", express_1.default.static("build/www"));
}
/** Error handling */
router.use("*", function (_, res) {
    var error = new Error("Not found");
    res.status(404).json({
        message: error.message
    });
});
var httpServer = http_1.default.createServer(router);
httpServer.listen(config_1.default.server.httpPort, function () { return logging_1.default.info(NAMESPACE, "Server is running http://" + config_1.default.server.hostname + ":" + config_1.default.server.httpPort); });
