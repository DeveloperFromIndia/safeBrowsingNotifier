import { DataTypes } from "sequelize";
import SequelizeConfig from "../../config.js";

const SiteModel = SequelizeConfig.define("site", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    url: { type: DataTypes.STRING },
    isAlive: { type: DataTypes.BOOLEAN, allowNull: true },
    cause: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
    updateAt: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
    // FK
    telegramId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    timestamps: false,
});

export default SiteModel;