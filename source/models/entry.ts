import { DataTypes } from "sequelize";
import { sequelize } from "../sql";

const Entry = sequelize.define('Entry', {
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


export default { Entry };