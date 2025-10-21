import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Application = sequelize.define('Application', {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    event_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'events',
            key: 'event_id',
        },
    },
    volunteer_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'volunteers',
            key: 'volunteer_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'attended'),
        allowNull: false,
        defaultValue: 'pending',
    },
    appliedAt: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
    approvedAt: {type: DataTypes.DATE, allowNull: true},
    isCancelled: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
}, {
    tableName: 'applications',
    timestamps: false,
});
export default Application;

