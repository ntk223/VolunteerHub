import { DataTypes, or } from "sequelize";
import sequelize from "../config/database.js";

const Manager = sequelize.define('Manager', {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    userId : {
        type: DataTypes.BIGINT, 
        allowNull: false, 
        unique: true,
        references: {
            model: 'users', // name of Target model
            key: 'id', // key in Target model that we're referencing
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