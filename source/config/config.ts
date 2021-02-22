const sql = {
	database: "economy",
	username: process.env.dbUser || "economy",
	password: process.env.dbPassword || "economy",
	host: "localhost",
	port: 3306,
	dialect: "mariadb",
	logging: false,
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "0.0.0.0";
const SERVER_PORT = process.env.SERVER_PORT || 8080;

const SERVER = {
	hostname: SERVER_HOSTNAME,
	port: SERVER_PORT
};

const config = {
	sql: sql,
	server: SERVER
};

export default config;