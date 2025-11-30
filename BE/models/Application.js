import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Application = sequelize.define(
  "Application",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    eventId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "events",
        key: "eventId",
      },
    },
    volunteerId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "volunteers",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected", "attended"),
      allowNull: false,
      defaultValue: "pending",
    },
    appliedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    approvedAt: { type: DataTypes.DATE, allowNull: true },
    isCancelled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "applications",
    timestamps: false,
    underscored: true,
  }
);
export default Application;
