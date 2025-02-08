import { DataTypes } from "sequelize";
import SequelizeConfig from "../../config.js";

const UserModel = SequelizeConfig.define("bot_user", {
    telegramId: { type: DataTypes.INTEGER, unique: true, primaryKey: true, allowNull: false},
    username: { type: DataTypes.STRING },
});

export default UserModel;