const sql = {
	database: process.env.DB_DATABASE || "economy",
	username: process.env.DB_USER     || "economy",
	password: process.env.DB_PASSWORD || "economy",
	host:  process.env.DB_HOST        || "localhost",
	port: process.env.DB_PORT         || 3306,
	dialect: "mariadb",
	// if dbLogging is set, logg, otherwise don't log any queries 
	logging: process.env.dbLogging !== undefined,
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "0.0.0.0";
const SERVER_HTTPS_PORT = process.env.SERVER_HTTPS_PORT || 4433;

const SERVER = {
	hostname: SERVER_HOSTNAME,
	httpsPort: SERVER_HTTPS_PORT,
};

const config = {
	sql: sql,
	server: SERVER
};

export default config;
