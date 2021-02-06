import { Sequelize } from "sequelize";
import config from "./config/config";

export const MariaDB = new Sequelize(
    config.sql.database, config.sql.username, config.sql.password,
    {
        host: config.sql.host,
        dialect: 'mariadb',
        logging: config.sql.logging
    }
);