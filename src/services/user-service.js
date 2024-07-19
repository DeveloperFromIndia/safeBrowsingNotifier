import UserModel from "../database/models/Other/user.js";

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
}

export default new UserService;