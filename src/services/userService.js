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
            users.forEach(async user => {
                await sendMessageToUser(user.telegramId, text)
                    .catch(err => {
                        console.error(err);
                    })
            });
        } catch (error) {
            console.error(error);
        }
    }
}

export default new UserService;