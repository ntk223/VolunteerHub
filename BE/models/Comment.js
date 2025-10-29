import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Comment = sequelize.define('Comment', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    postId: { 
        type: DataTypes.BIGINT, 
        allowNull: false,
        references: {
            model: 'posts', // name of Target model
            key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    authorId: { 
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'users', // name of Target model
            key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    content: { type: DataTypes.TEXT, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
    tableName: 'comments',
    timestamps: true,
    paranoid: true,
    deletedAt: "deleted_at",
    underscored: true,
})

export default Comment


