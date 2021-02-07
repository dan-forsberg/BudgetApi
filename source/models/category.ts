import { DataTypes, Model } from "sequelize";
import { MariaDB } from "../sql";
//import ICategory from "../interfaces/category";

interface CategoryInstance extends Model {
    category: string;
    id: number;
}

const Category = MariaDB.define<CategoryInstance>("Category", {
	category: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	}
});

export { Category, CategoryInstance };