import Sequelize, { DataTypes } from "sequelize";
import { MariaDB } from "../sql";
import { Category } from "./category";

const Entry = MariaDB.define('Entry', {
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category: {
        type: Sequelize.INTEGER,
        references: {
            model: Category,
            key: 'id'
        }
    }
});


export { Entry };