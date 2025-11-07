import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Post = sequelize.define("Post", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    eventId: {
        type: DataTypes.BIGINT, 
        allowNull: true ,
        references: {
            model: 'events', // name of Target model
            key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }, 
    authorId : { type: DataTypes.BIGINT, allowNull: false,
        references: {
            model: 'users', // name of Target model
            key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    postType: {
        type:DataTypes.ENUM('discuss', 'recruitment'),
        allowNull: false,
        defaultValue: 'discuss'
    },
    content: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), allowNull: false, defaultValue: 'pending' },
    imageUrl: { type: DataTypes.JSON, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },

}, {
    tableName: "posts",
    timestamps: true,
    paranoid: true,
    deletedAt: "deleted_at",
    underscored: true,
});


export default Post;
