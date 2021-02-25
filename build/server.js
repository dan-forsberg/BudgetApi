"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var https_1 = __importDefault(require("https"));
var http_1 = __importDefault(require("http"));
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
var production = process.env.NODE_ENV === "production";
var authConfig = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.secret,
    baseURL: process.env.baseURL,
    clientID: process.env.clientID,
    issuerBaseURL: process.env.issuerBaseURL
};
var credentials = undefined;
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
    router.use(express_openid_connect_1.auth(authConfig));
    try {
        var letsEncrypt = process.env.letsEncrypt;
        var privateKey = fs_1.default.readFileSync(letsEncrypt + "/privkey.pem", "utf8");
        var certificate = fs_1.default.readFileSync(letsEncrypt + "//cert.pem", "utf8");
        var ca = fs_1.default.readFileSync(letsEncrypt + "//chain.pem", "utf8");
        credentials = {
            key: privateKey,
            cert: certificate,
            ca: ca
        };
    }
    catch (err) {
        logging_1.default.error(NAMESPACE, "Could not find or read LE-keys. Exiting.");
        process.exit(1);
    }
}
router.use(cors_1.default());
/** Log the request */
router.use(function (req, res, next) {
    logging_1.default.info(NAMESPACE, "METHOD: [" + req.method + "] - URL: [" + req.url + "] - IP: [" + req.socket.remoteAddress + "]");
    res.on("finish", function () {
        logging_1.default.info(NAMESPACE, "METHOD: [" + req.method + "] - URL: [" + req.url + "] - STATUS: [" + res.statusCode + "] - IP: [" + req.socket.remoteAddress + "]");
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
}
else {
    router.use("/api/entry", entry_1.default);
    router.use("/api/category", category_1.default);
    router.use("/api/default", defaultEntry_1.default);
    router.use("/", express_1.default.static("build/www"));
}
/** Error handling */
router.use("*", function (_, res) {
    var error = new Error("Not found");
    res.status(404).json({
        message: error.message
    });
});
if (production) {
    if (!credentials) {
        logging_1.default.error(NAMESPACE, "No credentials. Exiting.");
        process.exit(1);
    }
    var httpsServer = https_1.default.createServer(credentials, router);
    httpsServer.listen(config_1.default.server.httpsPort, function () { return logging_1.default.info(NAMESPACE, "Server is running https://" + config_1.default.server.hostname + ":" + config_1.default.server.httpsPort); });
    // TODO: add a http server to redirect to HTTPS
}
else {
    var httpServer = http_1.default.createServer(router);
    httpServer.listen(config_1.default.server.httpPort, function () { return logging_1.default.info(NAMESPACE, "Server is running http://" + config_1.default.server.hostname + ":" + config_1.default.server.httpPort); });
}
