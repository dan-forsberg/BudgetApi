import http from "http";
import express from "express";
import cors from "cors";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";

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
const production = process.env.NODE_ENV === "production";

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

router.use(cors());

/** Log the request */
router.use((req, _, next) => {
	const IP = req.header("x-real-ip");
	logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${IP}]`);
	next();
});

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// router.use("/api", (req, res, next) => {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

// 	if (req.method == "OPTIONS") {
// 		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
// 		return res.status(200).json({});
// 	}

// 	next();
// });

if (production) {
	const authConfig = {
		"domain": "dev-dasifor.eu.auth0.com",
		"clientId": "vhUNwnbQjgfNYQidvev130RipVSa28ay",
		"audience": "https://dasifor.xyz/api"
	};
	const checkJwt = jwt({
		secret: jwksRsa.expressJwtSecret({
			cache: true,
			rateLimit: true,
			jwksRequestsPerMinute: 5,
			jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
		}),

		audience: authConfig.audience,
		issuer: `https://${authConfig.domain}/`,
		algorithms: ["RS256"]
	});

	router.use("/api/entry", checkJwt, entryRoutes);
	router.use("/api/category", checkJwt, categoryRoutes);
	router.use("/api/default", checkJwt, defaultRoutes);
} else {
	router.use("/api/entry", entryRoutes);
	router.use("/api/category", categoryRoutes);
	router.use("/api/default", defaultRoutes);
}

/** Error handling */
router.use("*", (_, res) => {
	const error = new Error("Not found");

	res.status(404).json({
		message: error.message
	});
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.use(function (err: Error, _req: unknown, _res: unknown, _next: unknown) {
	logging.error(NAMESPACE, "Error: " + err.message);
});

const httpServer = http.createServer(router);
httpServer.listen(config.server.httpPort, () => logging.info(NAMESPACE, `Server is running http://${config.server.hostname}:${config.server.httpPort}`));
