import {DataTypes} from "sequelize";
import sequelize from "../config/database.js";

const Event = sequelize.define("Event", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    category_id :{
        type: DataTypes.BIGINT, 
        allowNull: false,
        references: {
            model: 'categories', // name of Target model
            key: 'category_id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    title: {type: DataTypes.STRING(255), allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: true},
    location: {type: DataTypes.STRING(255), allowNull: false},
    start_time: {type: DataTypes.DATE, allowNull: false},
    end_time: {type: DataTypes.DATE, allowNull: false},
    capacity: {type: DataTypes.INTEGER, allowNull: false},
    status: {type: DataTypes.ENUM('pending', 'approved', 'completed', 'cancelled'), defaultValue: 'pending'},
    manager_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'managers', // name of Target model
            key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    createdAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    updatedAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
}, {
    tableName: 'events',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deletedAt',
})
// console.log(sequelize.config);

export default Event;