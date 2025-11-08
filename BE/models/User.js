import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define('User', {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(150), allowNull: false},
    phone: {type: DataTypes.STRING(30), allowNull: false, unique: true},
    email: {type: DataTypes.STRING(255), allowNull: false, unique: true},
    password: {type: DataTypes.TEXT, allowNull: false},
    introduce: {type: DataTypes.TEXT, allowNull: true},
    role: {type: DataTypes.ENUM('volunteer', 'manager', 'admin'), defaultValue: 'volunteer'},
    status: {type: DataTypes.ENUM('active', 'blocked'), defaultValue: 'active'},
    avatarUrl: {type: DataTypes.STRING, allowNull: true},
    createdAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    updatedAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
}, {
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    underscored: true,
});

export default User;
