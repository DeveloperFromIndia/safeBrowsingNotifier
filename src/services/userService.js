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

    async getUsersByPage(currentPage, count, telegramId) {
        try {
            const offset = (currentPage - 1) * count;
            const totalUsers = await UserModel.count();
            const totalPages = Math.ceil(totalUsers / count);

            const users = await UserModel.findAll({
                offset,
                limit: count,
                order: [
                    ['access', 'DESC']
                ],
            });
            return {
                totalPages,
                currentPage,
                users,
            }
        } catch (error) {
            console.error(error);
        }

    }

    getUserSign(access) {
        switch (access) {
            case 0:
                return "❌";
            case 1:
                return "⏳";
            case 2:
                return "🧎🏻‍♂️";
            case 3:
                return "🚶🏻";
        }
    }
}

export default new UserService;