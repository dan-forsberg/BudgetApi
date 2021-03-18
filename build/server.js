"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var express_jwt_1 = __importDefault(require("express-jwt"));
var jwks_rsa_1 = __importDefault(require("jwks-rsa"));
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
if (production) {
    var authConfig = {
        "domain": "dev-dasifor.eu.auth0.com",
        "clientId": "vhUNwnbQjgfNYQidvev130RipVSa28ay",
        "audience": "https://dasifor.xyz/api"
    };
    var checkJwt = express_jwt_1.default({
        secret: jwks_rsa_1.default.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: "https://" + authConfig.domain + "/.well-known/jwks.json"
        }),
        audience: authConfig.audience,
        issuer: "https://" + authConfig.domain + "/",
        algorithms: ["RS256"]
    });
    router.use("/api/entry", checkJwt, entry_1.default);
    router.use("/api/category", checkJwt, category_1.default);
    router.use("/api/default", checkJwt, defaultEntry_1.default);
}
else {
    router.use("/api/entry", entry_1.default);
    router.use("/api/category", category_1.default);
    router.use("/api/default", defaultEntry_1.default);
}
/** Error handling */
router.use("*", function (_, res) {
    var error = new Error("Not found");
    res.status(404).json({
        message: error.message
    });
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.use(function (err, _req, _res, _next) {
    logging_1.default.error(NAMESPACE, "Error: " + err.message);
});
var httpServer = http_1.default.createServer(router);
httpServer.listen(config_1.default.server.httpPort, function () { return logging_1.default.info(NAMESPACE, "Server is running http://" + config_1.default.server.hostname + ":" + config_1.default.server.httpPort); });
