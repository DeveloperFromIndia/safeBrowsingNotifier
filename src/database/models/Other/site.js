import { DataTypes } from "sequelize";
import SequelizeConfig from "../../config.js";

const SiteModel = SequelizeConfig.define("Site", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    url: { type: DataTypes.STRING },
    isAlive: { type: DataTypes.BOOLEAN, allowNull: true },
});

export default SiteModel;