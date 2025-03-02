import { sendMessageToUser } from "../bot.js";
import { listUsers, usersInlineActions } from "../keyboards/inline-keyboard.js";
import userService from "../services/userService.js";
import websitesService from "../services/websitesService.js";
import { userView } from "../views/users/user.view.js";

const countInPage = 10;
export const getUsersList = async (ctx) => {
    try {
        const res = await userService.getUsersByPage(1, countInPage, ctx.message.from.id);
        const [title, keyboard] = listUsers(res)
        return ctx.reply(title, keyboard)
    } catch (error) {
        console.error(error);
    }
}

export const anotherPageInUserList = async (ctx) => {
    try {
        const { id, username } = ctx.update.callback_query.from;
        await userService.firstStart(id, username);

        const page = ctx.match[0].split(' ')[0];
        const res = await userService.getUsersByPage(page, countInPage, id)
        await ctx.answerCbQuery();
        const [title, keyboard] = listUsers(res)
        await ctx.editMessageText(title, keyboard);
    } catch (error) {
        console.error(error);
    }
}

export const getUserById = async (ctx) => {
    const { id, username } = ctx.update.callback_query.from;
    await userService.firstStart(id, username);
    try {
        await ctx.answerCbQuery();
        const userTelegramId = ctx.match[0].split(' ')[0];
        
        const user = await userService.getUser(userTelegramId);
        const userSign = userService.getUserSign(user.access);

        const totalInfo = await userView(userTelegramId, user.username, userSign);

        return ctx.reply(totalInfo, usersInlineActions(user.telegramId));
    } catch (error) {
        console.error(error);
    }
}

export const changeUserAccessById = async (ctx) => {
    await ctx.answerCbQuery();
    const userTelegramId = ctx.match[0].split(' ')[0];
    const role = ctx.match[0].split(' ')[2];
    const user = await userService.getUser(userTelegramId);

    if (!user)
        return ctx.reply("Пользователь не найден");

    user.access = role;
    await user.save();

    const userSign = userService.getUserSign(Number(role));
    const totalInfo = await userView(userTelegramId, user.username, userSign);
    
    try {
        await ctx.editMessageText(totalInfo, usersInlineActions(user.telegramId))
        if (role == 0)
            return await sendMessageToUser({
                chatId: userTelegramId,
                message: "🎷Вы заблокированы🎺"
            });
        await sendMessageToUser({
            chatId: userTelegramId,
            message: "✅ Ваши права доступа обновлены!\n\n" +
                "Напишите /start, чтобы узнать, какие новые возможности вам теперь доступны."
        });
    } catch (error) {

    }
}