import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PushSubscription = sequelize.define("PushSubscription", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  endpoint: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  p256dh: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  auth: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "push_subscriptions",
  timestamps: false,
  underscored: true,
});

export default PushSubscription;
