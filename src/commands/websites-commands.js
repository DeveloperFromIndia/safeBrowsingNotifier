import { listWebsites, websiteInlineActions } from "../keyboards/inline-keyboard.js";
import userService from "../services/userService.js";
import websitesService from "../services/websitesService.js";
import { websiteView } from "../views/website/website.view.js";

export const getWebsiteById = async (ctx) => {
    try {
        const telegramId = ctx.update.callback_query.from.id;
        const websiteId = ctx.match[0].split(' ')[0];

        const website = await websitesService.getWebsiteById(websiteId);
        if (website === null) {
            await ctx.answerCbQuery("⚠️ Домен не найден или у него другой владелец", { show_alert: true });;
        }
        let sign = websitesService.getWebsiteSign(website.isAlive);

        const keyboard = websiteInlineActions({ websiteId: website.id, permissions: [website.telegramId == telegramId ? "holder" : "public"] })
        await ctx.reply(websiteView({ id: website.id, sign: sign, url: website.url }), keyboard);
    } catch (error) {
        console.error(error)
    }
}

export const deleteWebsiteById = async (ctx) => {
    const telegramId = ctx.update.callback_query.from.id;
    try {
        await ctx.answerCbQuery();

        const websiteId = ctx.match[0].split(' ')[0];
        const websiteActionResult = await websitesService.deleteWebsiteById(websiteId, telegramId);
        if (!websiteActionResult)
            await ctx.answerCbQuery("⚠️ Домен не найден или у него другой владелец", { show_alert: true });
        await ctx.deleteMessage();
    } catch (error) {
        console.error(error);
    }
}

export const toggleSubscription = async (ctx) => {
    try {
        const { id, username } = ctx.update.callback_query.from;
        await userService.firstStart(id, username);
        const websiteId = ctx.match[0].split(' ')[0];

        const website = await websitesService.toggleSubscription(websiteId, id);

        if (!website)
            return await ctx.answerCbQuery("⚠️ Домен не найден или у него уже появился владелец.", { show_alert: true });

        const keyboard = websiteInlineActions({ websiteId, permissions: [id == website.telegramId ? "holder" : "public"] })
        const sign = websitesService.getWebsiteSign(website.isAlive);
        return await ctx.editMessageText(websiteView({ id: website.id, sign: sign, url: website.url }), keyboard);
    } catch (error) {
        console.error(error);
    }
}

export const printAuditedList = async (ctx) => {
    ctx.answerCbQuery();
    const telegramId = ctx.update.callback_query.from.id;
    const numbers = ctx.match[0].match(/\d+/g);
    numbers.forEach(async websiteId => {
        const website = await websitesService.getWebsiteById(websiteId);
        const sign = websitesService.getWebsiteSign(website.isAlive);
        const keyboard = websiteInlineActions({ websiteId: website.id, permissions: [website.telegramId == telegramId ? "holder" : "public"] })
        await ctx.reply(websiteView({ id: website.id, sign: sign, url: website.url }), keyboard);
    });
}