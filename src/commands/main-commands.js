import { MainKeyboard } from "../keyboards/main-keyboard.js"
import UserService from "../services/userService.js"
import WebsitesService from "../services/websitesService.js";

export const start = async(ctx) => {
    const userMessage = ctx.message; 
    await UserService.firstStart(userMessage.from.id, userMessage.from.username);
    const title = await WebsitesService.getTotalInfo();

    ctx.replyWithHTML(title, MainKeyboard)
}