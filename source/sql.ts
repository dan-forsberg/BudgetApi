import { Sequelize } from "sequelize";
import config from "./config/config";
import logging from "./config/logging";

const NAMESPACE = "SQL"

export const sequelize = new Sequelize(
    config.sql.database, config.sql.username, config.sql.password,
    {
        host: config.sql.host,
        dialect: 'mariadb'
    }
);

export function connect() {
    /** Connect to MariaDB */
    sequelize.authenticate().then(() => {
        logging.info(NAMESPACE, "MariaDB connected successfully!");
    });
    // Do not catch
    // Instead let the server crash to not continue.
}