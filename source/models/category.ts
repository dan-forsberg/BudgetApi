import { DataTypes } from "sequelize";
import logging from "../config/logging";
import { sequelize } from "../sql";

const Category = sequelize.define('Category', {
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ID: {
        type: DataTypes.NUMBER,
        allowNull: false,
        unique: true
    }
});

// "CREATE TABLE IF NOT EXISTS"
Category.sync().then(
    () => { logging.info("Category-Model", "Category table created.") }
);

export default { Category };