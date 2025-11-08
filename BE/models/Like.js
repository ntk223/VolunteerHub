import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Like = sequelize.define('Like', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    userId : { 
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'users', // name of Target model
            key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    postId: { 
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
    deletedAt: { type: DataTypes.DATE, allowNull: true },
}, {
    tableName: 'likes',
    timestamps: true,
    updatedAt: false,
    paranoid: true,
    underscored: true,
})

export default Like