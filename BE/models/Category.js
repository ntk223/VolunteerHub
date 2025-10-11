import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Category = sequelize.define('Category', {
    category_id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(150), allowNull: false, unique: true},
    description: {type: DataTypes.TEXT, allowNull: true},
}, {
    tableName: 'categories',
    timestamps: false,
});

export default Category;

