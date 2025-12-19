import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Volunteer = sequelize.define('Volunteer', {
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
    credibility: {type: DataTypes.INTEGER, defaultValue: 0},
    contributed: {type: DataTypes.INTEGER, defaultValue: 0},
}, {
    tableName: 'volunteers',
    timestamps: false,
    underscored: true,
})


export default Volunteer;