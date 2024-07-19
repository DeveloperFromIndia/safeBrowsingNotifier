import { DataTypes } from "sequelize";
import SequelizeConfig from "../../config.js";

const UserModel = SequelizeConfig.define("User", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING },
    telegramId: { type: DataTypes.INTEGER, unique: true },
});

export default UserModel;