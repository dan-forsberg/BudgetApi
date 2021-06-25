import { DataTypes, Model } from "sequelize";
import { MariaDB } from "../sql";

interface CategoryModel extends Model {
	name: string;
	id: number;
	continuousUpdate: boolean;
}

const Category = MariaDB.define<CategoryModel>("Category", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	continuousUpdate: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: 0 // false
	}
});

export { Category, CategoryModel };