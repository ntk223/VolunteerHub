import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Volunteer = sequelize.define('Volunteer', {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    user_id : {
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
    credibility: {type: DataTypes.INTEGER, defaultValue: 0},
    contributed: {type: DataTypes.INTEGER, defaultValue: 0},
}, {
    tableName: 'volunteers',
    timestamps: false,
})


export default Volunteer;