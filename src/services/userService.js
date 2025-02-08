import UserModel from "../database/models/Other/user.js";
import { sendMessageToUser } from "../bot.js";

class UserService {
    async firstStart(telegramId, username) {
        try {
            const user = await UserModel.findOrCreate({
                where: { telegramId: telegramId },
                defaults: {
                    username: username,
                    telegramId: telegramId,
                }
            });
            return user;
        } catch (error) {
            throw error;
        }
    }
    async getUser(telegramId) {
        const user = await UserModel.findOne({ where: { telegramId } });
        return user;
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