import { makeFromResponseInlineList } from "../keyboards/inline-keyboard.js";
import websitesService from "../services/websites-service.js";

export const getWebsitesList = async (ctx) => {
    try {
        const res = await websitesService.getWebsitesByPage(1, 6);
        const [title, keyboard] = makeFromResponseInlineList(res)
        ctx.reply(title, keyboard)

    } catch (error) {
        console.error(error);
    }
}