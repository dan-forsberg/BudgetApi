import http from "http";
import https from "https";
import express from "express";
import cors from "cors";
import fs from "fs";

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

const privateKey = fs.readFileSync("/etc/letsencrypt/live/dasifor.xyz/privkey.pem", "utf8");
const certificate = fs.readFileSync("/etc/letsencrypt/live/dasifor.xyz//cert.pem", "utf8");
const ca = fs.readFileSync("/etc/letsencrypt/live/dasifor.xyz//chain.pem", "utf8");

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};


/** Connect to MariaDB */
MariaDB.authenticate().then(() => {
	logging.info(NAMESPACE, "MariaDB connected successfully!");
	Category.sync().then(() => {
		Entry.sync();
		DefaultEntry.sync();
	});
});
/** Do not catch, let the server crash and burn terribly. */

/** Log the request */
router.use((req, res, next) => {
	/** Log the req */
	logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

	res.on("finish", () => {
		/** Log the res */
		logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
	});

	next();
});

router.use(cors());


/** Parse the body of the request */
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

/** Rules of our API */
router.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

	if (req.method == "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json({});
	}

	next();
});

/** Routes go here */
router.use("/api/entry", entryRoutes);
router.use("/api/category", categoryRoutes);
router.use("/api/default", defaultRoutes);

/** Error handling */
router.use((_, res) => {
	const error = new Error("Not found");

	res.status(404).json({
		message: error.message
	});
});

//const httpServer = http.createServer(router);
const httpsServer = https.createServer(credentials, router);

httpsServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running https://${config.server.hostname}:${config.server.port}`));