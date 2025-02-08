import { DataTypes } from "sequelize";
import SequelizeConfig from "../../config.js";
import UserModel from "./user.js";

const SiteModel = SequelizeConfig.define("site", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    url: { type: DataTypes.STRING },
    isAlive: { type: DataTypes.BOOLEAN, allowNull: true },
    cause: { type: DataTypes.STRING, allowNull: true },
    // FK
    telegramId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
});

export default SiteModel;