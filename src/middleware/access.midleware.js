import userService from "../services/userService.js";

const accessMiddleware = (requiredLevel) => async (ctx, next) => {
    try {
        ctx.answerCbQuery();  
    } catch (error) {

    }

    const userId = ctx.from.id;
    const user = await userService.getUser(userId);
    const userAccessLevel = user.access || 1;

    if (userAccessLevel >= requiredLevel) {
        return next(); 
    } else {
        return ctx.reply("❌ У вас недостаточно прав для использования этой команды.");
    }
};

export default accessMiddleware;