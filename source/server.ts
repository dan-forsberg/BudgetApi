import https from "https";
import http from "http";
import express from "express";
import cors from "cors";
import fs from "fs";
import { auth, requiresAuth } from "express-openid-connect";

import logging from "./config/logging";
import config from "./config/config";

import entryRoutes from "./routes/entry";
import categoryRoutes from "./routes/category";
import defaultRoutes from "./routes/defaultEntry";

import { MariaDB } from "./sql";
import { Entry } from "./models/entry";
import { Category } from "./models/category";
import { DefaultEntry } from "./models/defaultEntry";

const NAMESPACE = "Server";
const router = express();

let credentials: { key: string, cert: string, ca: string; } | undefined = undefined;
try {
	const letsEncrypt = process.env.letsEncrypt;
	const privateKey = fs.readFileSync(`${letsEncrypt}/privkey.pem`, "utf8");
	const certificate = fs.readFileSync(`${letsEncrypt}//cert.pem`, "utf8");
	const ca = fs.readFileSync(`${letsEncrypt}//chain.pem`, "utf8");

	credentials = {
		key: privateKey,
		cert: certificate,
		ca: ca
	};
} catch (err) {
	logging.error(NAMESPACE, "Could not find LE-files or .env. Starting server as HTTP!\n", err.message);
}

const authConfig = {
	authRequired: false,
	auth0Logout: true,
	secret: process.env.secret,
	baseURL: process.env.baseURL,
	clientID: process.env.clientID,
	issuerBaseURL: process.env.issuerBaseURL
};

MariaDB.authenticate().then(() => {
	logging.info(NAMESPACE, "MariaDB connected successfully!");
	Category.sync().then(() => {
		Entry.sync();
		DefaultEntry.sync();
	});
}).catch((err) => {
	logging.error(NAMESPACE, "Could not connect to MariaDB. Exiting.", err.message);
	process.exit(1);
});

try {
	router.use(auth(authConfig));
} catch (err) {
	logging.error(NAMESPACE, "Could not start authentication. Exiting.", err.message);
	process.exit(1);
}
router.use(cors());

/** Log the request */
router.use((req, res, next) => {
	logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

	res.on("finish", () => {
		logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
	});

	next();
});

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use("/api", (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

	if (req.method == "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json({});
	}

	next();
});

/** Routes go here */
router.use("/api/entry", requiresAuth(), entryRoutes);
router.use("/api/category", requiresAuth(), categoryRoutes);
router.use("/api/default", requiresAuth(), defaultRoutes);

/** Static files */
router.use("/", requiresAuth(), express.static("build/www"));

/** Error handling */
router.use("*", (_, res) => {
	const error = new Error("Not found");

	res.status(404).json({
		message: error.message
	});
});

if (credentials !== undefined) {
	const httpsServer = https.createServer(credentials, router);
	httpsServer.listen(config.server.httpsPort, () => logging.info(NAMESPACE, `Server is running https://${config.server.hostname}:${config.server.httpsPort}`));
	// TODO: add a http server to redirect to HTTPS
} else {
	logging.info(NAMESPACE, "Starting HTTP-server, but no HTTPS!");
	const httpServer = http.createServer(router);
	httpServer.listen(config.server.httpPort, () => logging.info(NAMESPACE, `Server is running http://${config.server.hostname}:${config.server.httpPort}`));
}