import { MainKeyboard } from "../keyboards/main-keyboard.js"
import UserService from "../services/userService.js"
import WebsitesService from "../services/websitesService.js";

export const start = async (ctx) => {
    const { id, username } = ctx.message.from;
    await UserService.firstStart(id, username);
    const title = await WebsitesService.getTotalInfo(id);

    ctx.replyWithHTML(title, MainKeyboard)
}