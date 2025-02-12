import { listWebsites, websiteInlineActions } from "../keyboards/inline-keyboard.js";
import userService from "../services/userService.js";
import websitesService from "../services/websitesService.js";

const countInPage = 10;
export const getWebsitesList = async (ctx) => {
    try {
        const res = await websitesService.getWebsitesByPage(1, countInPage, ctx.message.from.id);
        const [title, keyboard] = listWebsites(res)
        ctx.reply(title, keyboard)
    } catch (error) {
        console.error(error);
    }
}

export const showWebsitesList = async (ctx) => {
    const telegramId = ctx.update.callback_query.from.id;
    try {
        await ctx.answerCbQuery();
        const elements = ctx.update.callback_query.message.reply_markup.inline_keyboard.filter(e => e.length == 1); elements.shift();
        const result = elements.map(e => e[0].callback_data.split(' ')[0]);
        for (const i in result) {
            const site = await websitesService.getWebsiteById(result[i]);
            const sign = websitesService.getWebsiteSign(site.isAlive);
            const keyboard = websiteInlineActions({ websiteId: site.id, permissions: [site.telegramId == telegramId ? "holder" : "public"] })
            await ctx.reply(`ID: ${site.id} ${sign}\nURL: ${site.url}`, keyboard);
        }
    } catch (error) {
        console.error(error);
    }
}

export const anotherPageInWebsitesList = async (ctx) => {
    const { id, username } = ctx.update.callback_query.from;
    await userService.firstStart(id, username);
    try {
        const page = ctx.match[0].split(' ')[0];
        const res = await websitesService.getWebsitesByPage(page, countInPage, id)
        await ctx.answerCbQuery();
        const [title, keyboard] = makeFromResponseInlineList(res)
        await ctx.editMessageText(title, keyboard);
    } catch (error) {
        console.error(error);
    }
}

export const getWebsiteById = async (ctx) => {
    try {
        const telegramId = ctx.update.callback_query.from.id;
        const websiteId = ctx.match[0].split(' ')[0];

        const website = await websitesService.getWebsiteById(websiteId);
        await ctx.answerCbQuery()
        if (website === null) {
            return await ctx.reply("Вебсайт не найден");
        }
        let sign = websitesService.getWebsiteSign(website.isAlive);

        const keyboard = websiteInlineActions({ websiteId: website.id, permissions: [website.telegramId == telegramId ? "holder" : "public"] })
        await ctx.reply(`ID: ${website.id} ${sign}\nURL: ${website.url}`, keyboard);
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

        const res = await websitesService.toggleSubscription(websiteId, id);
        ctx.answerCbQuery();
        if (!res)
            return await ctx.answerCbQuery("⚠️ Домен не найден или у него уже появился владелец.", { show_alert: true });

        const keyboard = websiteInlineActions({ websiteId, permissions: [id == res.telegramId ? "holder" : "public"] })
        const sign = websitesService.getWebsiteSign(res.isAlive);
        return await ctx.editMessageText(`ID: ${res.id} ${sign}\nURL: ${res.url}`, keyboard);
    } catch (error) {
        console.error(error);
    }
}

export const printAuditedList = async (ctx) => {
    ctx.answerCbQuery();
    const telegramId = ctx.update.callback_query.from.id;
    const numbers = ctx.match[0].match(/\d+/g);
    numbers.forEach(async websiteId => {
        const site = await websitesService.getWebsiteById(websiteId);
        const sign = websitesService.getWebsiteSign(site.isAlive);
        const keyboard = websiteInlineActions({ websiteId: site.id, permissions: [site.telegramId == telegramId ? "holder" : "public"] })
        await ctx.reply(`ID: ${site.id} ${sign}\nURL: ${site.url}`, keyboard);
    });
}