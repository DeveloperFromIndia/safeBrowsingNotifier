import { DataTypes } from "sequelize";
import SequelizeConfig from "../../config.js";

const UserModel = SequelizeConfig.define("bot_user", {
    telegramId: { type: DataTypes.INTEGER, unique: true, primaryKey: true, allowNull: false },
    username: { type: DataTypes.STRING },
    access: { type: DataTypes.INTEGER, defaultValue: 1 },
    createdAt: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
    updateAt: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
}, {
    timestamps: false,
});

/*
    0 - blocked 
    1 - req
    2 - buyer
    3 - leed
*/

export default UserModel;