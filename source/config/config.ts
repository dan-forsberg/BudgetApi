const sql = {
	database: process.env.db || "economy",
	username: process.env.dbUser || "economy",
	password: process.env.dbPassword || "economy",
	host: process.env.dbHost || "0.0.0.0",
	port: process.env.dbPort || 3306,
	dialect: "mariadb",
	// if dbLogging is set, logg, otherwise don't log any queries 
	logging: process.env.dbLogging !== undefined,
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "0.0.0.0";
const SERVER_HTTP_PORT = process.env.SERVER_HTTP_PORT || 8080;

const SERVER = {
	hostname: SERVER_HOSTNAME,
	httpPort: SERVER_HTTP_PORT
};

const config = {
	sql: sql,
	server: SERVER
};

export default config;