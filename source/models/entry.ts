import { DataTypes, Model } from "sequelize";
import { MariaDB } from "../sql";
import { Category } from "./category";

interface EntryModel extends Model {
	date: Date;
	description: string;
	amount: number;
	category: number;
	id: number;
}

const Entry = MariaDB.define<EntryModel>("Entry", {
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
	}
});


Entry.belongsTo(Category);


export { Entry };