import { Markup } from "telegraf";
import { cmd, inlineCmd } from "../utils/cmd.js";
import websitesService from "../services/websitesService.js";

export const websiteInlineActions = ({ websiteId, permissions }) => {
    const buttons = [];

    if (permissions.find(permission => permission == 'public')) {
        buttons.push([{ text: cmd.subsrcibeWebsite, callback_data: `${websiteId} subscribeSite` }]);
    } else if (permissions.find(permission => permission == 'holder')) {
        buttons.push([{ text: cmd.unscribeWebsite, callback_data: `${websiteId} unsubscribeSite` }]);
    }

    buttons.push([{ text: cmd.deleteWebsite, callback_data: `${websiteId} DeleteWebsite` }]);

    return Markup.inlineKeyboard(buttons);
};

export const websiteInlinePublicActions = (websiteId) => {
    return Markup.inlineKeyboard(
        [
            [{ text: cmd.unscribeWebsite, callback_data: `${websiteId} unsubscribeSite` }],
            [{ text: cmd.deleteWebsite, callback_data: `${websiteId} DeleteWebsite` }],
        ]
    )
}

export const websiteInlineHolderActions = (websiteId) => {
    return Markup.inlineKeyboard(
        [
            [{ text: cmd.subsrcibeWebsite, callback_data: `${websiteId} SubscribeSite` }],
            [{ text: cmd.deleteWebsite, callback_data: `${websiteId} DeleteWebsite` }],
        ]
    )
}

export const makeFromResponseInlineList = (response) => {
    try {
        let title = "";
        let keyboard = null;

        if (response.totalPages === 0) {
            title = "🧌 Тут пока пусто"
            keyboard = Markup.inlineKeyboard([{ text: cmd.addNewWebsite, callback_data: inlineCmd.addNewWebsite }]);
            return [title, keyboard];
        }

        title = `Страница ${response.currentPage} из ${response.totalPages}`
        const content = response.websites.map(item => {
            let sign = websitesService.getWebsiteSign(item.isAlive);
            return [{ text: `${item.url} - ${sign}`, callback_data: `${item.id} GWebsite` }]
        });

        const nextButton = Number(response.currentPage) + 1 > response.totalPages ? { text: '⏺', callback_data: "nothing" } : { text: '➡️', callback_data: `${Number(response.currentPage) + 1} NWebsitePage` }
        const prevButton = Number(response.currentPage) - 1 <= 0 ? { text: '⏺', callback_data: "nothing" } : { text: '⬅️', callback_data: `${response.currentPage - 1} PWebsitePage` }

        keyboard = Markup.inlineKeyboard([
            [{ text: cmd.addNewWebsite, callback_data: inlineCmd.addNewWebsite }],
            ...content,
            [
                prevButton,
                { text: '⏬', callback_data: inlineCmd.printAllWebsites },
                nextButton,
            ]
        ]);
        return [title, keyboard];
    } catch (error) {
        console.error(error);
    }
}
