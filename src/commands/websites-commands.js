import { Markup } from "telegraf";
import { makeFromResponseInlineList } from "../keyboards/inline-keyboard.js";
import websitesService from "../services/websites-service.js";
import { cmd } from "../utils/cmd.js";

const countInPage = 10;
export const getWebsitesList = async (ctx) => {
    try {
        const res = await websitesService.getWebsitesByPage(1, countInPage);
        const [title, keyboard] = makeFromResponseInlineList(res)
        ctx.reply(title, keyboard)
    } catch (error) {
        console.error(error);
    }
}

export const anotherPageInWebsitesList = async (ctx) => {
    try {
        const page = ctx.match[0].split(' ')[0];
        const res = await websitesService.getWebsitesByPage(page, countInPage)
        ctx.answerCbQuery();
        const [title, keyboard] = makeFromResponseInlineList(res)
        ctx.editMessageText(title, keyboard);
    } catch (error) {
        console.error(error);
    }
}

export const getWebsiteById = async (ctx) => {
    try {
        const websiteId = ctx.match[0].split(' ')[0];

        const website = await websitesService.getWebsiteById(websiteId);
        await ctx.answerCbQuery()
        if (website === null) {
            return await ctx.reply("Вебсайт не найден");
        }
        let sign = "";
        switch (website.isAlive) {
            case true:
                sign = "✅"
                break
            case false:
                sign = "❌"
                break
            case null:
                sign = "⏳"
        }
        await ctx.reply(`${website.id} | ${sign}\n${website.url}`, Markup.inlineKeyboard([{ text: cmd.deleteWebsite, callback_data: `${website.id} DeleteWebsite` }]))
    } catch (error) {
        console.error(error)
    }
}

export const deleteWebsiteById = async (ctx) => {
    try {
        const websiteId = ctx.match[0].split(' ')[0];
        const websiteActionResult = await websitesService.deleteWebsiteById(websiteId);
        if (websiteActionResult) {
            ctx.answerCbQuery();
            ctx.deleteMessage();
        }
    } catch (error) {
        console.error(error);
    }
}