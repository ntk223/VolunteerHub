import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Post = sequelize.define("Post", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    event_id: {
        type: DataTypes.BIGINT, 
        allowNull: true ,
        references: {
            model: 'events', // name of Target model
            key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
})
