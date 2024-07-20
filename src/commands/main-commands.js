import { MainKeyboard } from "../keyboards/main-keyboard.js"
import UserService from "../services/user-service.js"
import WebsitesService from "../services/websites-service.js";

export const start = async(ctx) => {
    const userMessage = ctx.message; 
    await UserService.firstStart(userMessage.from.id, userMessage.from.username);
    const title = await WebsitesService.getTotalInfo();

    ctx.replyWithHTML(title, MainKeyboard)
}