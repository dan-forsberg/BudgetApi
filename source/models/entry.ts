import Sequelize, { DataTypes, Model } from "sequelize";
import { MariaDB } from "../sql";
import { Category } from "./category";

interface EntryInstance extends Model {
    date: Date;
    description: string;
    amount: number;
    category: number;
    id: number;
}

const Entry = MariaDB.define<EntryInstance>("Entry", {
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
			key: "id"
		}
	}
});


export { Entry, EntryInstance };