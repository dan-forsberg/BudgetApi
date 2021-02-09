import { DataTypes, Model } from "sequelize";
import { MariaDB } from "../sql";

interface CategoryModel extends Model {
	name: string;
	id: number;
}

const Category = MariaDB.define<CategoryModel>("Category", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	}
});

export { Category, CategoryModel };