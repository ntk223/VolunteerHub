import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Manager = sequelize.define('Manager', {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    userId : {
        type: DataTypes.BIGINT, 
        allowNull: false, 
        unique: true,
        references: {
            model: 'users',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    organization: {type: DataTypes.STRING(255), allowNull: true},
}, {
    tableName: 'managers',
    timestamps: false,
    underscored: true,
})


export default Manager;