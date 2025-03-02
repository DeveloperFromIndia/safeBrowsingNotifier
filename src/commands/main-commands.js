import { UserKeyboard } from "../keyboards/main-keyboard.js"
import UserService from "../services/userService.js"
import websitesService from "../services/websitesService.js";

export const start = async (ctx) => {
    const { id, username } = ctx.message.from;
    await UserService.firstStart(id, username);
    const keyboard = await UserKeyboard(id);
    // const title = await websitesService.getDomainOverview(id);

    ctx.replyWithHTML("💵💵💵💵", keyboard)
}