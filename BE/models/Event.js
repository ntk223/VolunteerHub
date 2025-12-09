import {DataTypes} from "sequelize";
import sequelize from "../config/database.js";

const Event = sequelize.define("Event", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    categoryId :{
        type: DataTypes.BIGINT, 
        allowNull: false,
        references: {
            model: 'categories', // name of Target model
            key: 'categoryId', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    title: {type: DataTypes.STRING(255), allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: true},
    location: {type: DataTypes.STRING(255), allowNull: false},
    startTime: {type: DataTypes.DATE, allowNull: false},
    endTime: {type: DataTypes.DATE, allowNull: false},
    capacity: {type: DataTypes.INTEGER, allowNull: false},
    managerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'managers', // name of Target model
            key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    approvalStatus: {type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending'},
    progressStatus: {type: DataTypes.ENUM('incomplete','cancelled', 'completed'), defaultValue: 'incomplete'},
    imgUrl: {type: DataTypes.TEXT, allowNull: true},
    publishedAt: {type: DataTypes.DATE, allowNull: true},
    createdAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    updatedAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    deletedAt: {type: DataTypes.DATE, allowNull: true},
}, {
    tableName: 'events',
    timestamps: true,
    paranoid: true,
    underscored: true,
})
// console.log(sequelize.config);

export default Event;