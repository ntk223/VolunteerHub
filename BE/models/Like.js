import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Like = sequelize.define('Like', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id : { 
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'users', // name of Target model
            key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    post_id: { 
        type: DataTypes.BIGINT, 
        allowNull: true,
        references: {
            model: 'posts', // name of Target model
            key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
    tableName: 'likes',
    timestamps: false,
    paranoid: true,
    deletedAt: "deletedAt"
})

export default Like