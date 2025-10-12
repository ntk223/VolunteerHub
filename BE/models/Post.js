import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Post = sequelize.define("Post", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
})
