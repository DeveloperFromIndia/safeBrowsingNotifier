import { Telegram } from "telegraf";
import UserModel from "../database/models/Other/user.js";
import { sendMessageToUser } from "../bot.js";

class UserService {
    async firstStart(userTelegramId, username) {
        try {
            const user = await UserModel.findOrCreate({
                where: { telegramId: userTelegramId },
                defaults: {
                    username: username,
                    telegramId: userTelegramId,
                }
            });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async notifyAllUsers(text) {
        try {
            const users = await UserModel.findAll();
            users.forEach(user => {
                sendMessageToUser(user.telegramId, text)
            });
        } catch (error) {
            console.error(error);
        }
    }
}

export default new UserService;