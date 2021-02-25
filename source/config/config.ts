const sql = {
	database: "economy",
	username: process.env.dbUser || "economy",
	password: process.env.dbPassword || "economy",
	host: "localhost",
	port: 3306,
	dialect: "mariadb",
	// if dbLogging is set, logg, otherwise don't log any queries 
	logging: process.env.dbLogging !== undefined,
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "0.0.0.0";
const SERVER_HTTPS_PORT = process.env.SERVER_HTTPS_PORT || 4433;
const SERVER_HTTP_PORT = process.env.SERVER_HTTP_PORT || 8080;

const SERVER = {
	hostname: SERVER_HOSTNAME,
	httpsPort: SERVER_HTTPS_PORT,
	httpPort: SERVER_HTTP_PORT
};

const config = {
	sql: sql,
	server: SERVER
};

export default config;