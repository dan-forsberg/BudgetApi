import http from 'http';
import express from 'express';
import cors from 'cors';
import { Sequelize } from 'sequelize';

import logging from './config/logging';
import config from './config/config';
import entryRoutes from './routes/entry';
import categoryRoutes from './routes/category';


const NAMESPACE = 'Server';
const router = express();

/** Connect to MariaDB */
const sequelize = new Sequelize(
    config.sql.database, config.sql.username, config.sql.password,
    {
        host: config.sql.host,
        dialect: 'mariadb'
    }
);
sequelize.authenticate().then(() => {
    logging.info(NAMESPACE, "MariaDB connected successfully!");
}).catch((err) => {
    logging.error(NAMESPACE, "MariaDB unsuccessfully connected.", err)
});

/** Log the request */
router.use((req, res, next) => {
    /** Log the req */
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
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
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

/** Routes go here */
router.use('/api/entry', entryRoutes);
router.use('/api/category', categoryRoutes);

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running http://${config.server.hostname}:${config.server.port}`));