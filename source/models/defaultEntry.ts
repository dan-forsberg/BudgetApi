import { DataTypes, Model } from "sequelize";
import { MariaDB } from "../sql";
import { Category } from "./category";

/**
 * Some entries are more or less constant through every month.
 * For example, rent, food costs, insurances, etc.
 */

interface DefaultEntryModel extends Model {
	date: Date;
	description: string;
	amount: number;
	category: number;
	id: number;
}

const DefaultEntry = MariaDB.define<DefaultEntryModel>("DefaultEntry", {
	description: {
		type: DataTypes.STRING,
		allowNull: false
	},
	amount: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
});


DefaultEntry.belongsTo(Category);


export { DefaultEntry };