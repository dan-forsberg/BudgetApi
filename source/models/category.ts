import Sequelize, { DataTypes } from "sequelize";
import { MariaDB } from "../sql";

const Category = MariaDB.define('Category', {
    category: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export { Category };