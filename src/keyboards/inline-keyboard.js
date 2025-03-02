import util from "util";
import { Markup } from "telegraf";
import { cmd, inlineCmd } from "../utils/cmd.js";
import websitesService from "../services/websitesService.js";
import userService from "../services/userService.js";
import { websiteView } from "../views/website/website.view.js";

export const websiteInlineActions = ({ websiteId, permissions }) => {
    const buttons = [];

    if (permissions.find(permission => permission == 'public')) {
        buttons.push([{ text: cmd.subsrcibeWebsite, callback_data: `${websiteId} subscribeSite` }]);
        buttons.push([{ text: cmd.deleteWebsite, callback_data: `${websiteId} DeleteWebsite` }]);
    } else if (permissions.find(permission => permission == 'holder')) {
        buttons.push([{ text: cmd.unscribeWebsite, callback_data: `${websiteId} unsubscribeSite` }]);
        buttons.push([{ text: cmd.deleteWebsite, callback_data: `${websiteId} DeleteWebsite` }]);
    }
    
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

const listAcitions = (currentPage, totalPages, prev, next) => {
    const plug = { text: '⏺', callback_data: "nothing" };

    const p = Number(currentPage) - 1 <= 0 ? plug : { text: '⬅️', callback_data: `${Number(currentPage) - 1} ${prev}` }
    const n = Number(currentPage) + 1 > totalPages ? plug : { text: '➡️', callback_data: `${Number(currentPage) + 1} ${next}` }
    return [p, n]
}

const listUserItem = (item, status, id, callback_data) => {
    return [{ text: util.format("%s - %s", item, status), callback_data: `${id} ${callback_data}` }]
}

const listItem = (item, status, id, callback_data) => {
    return [{ text: util.format("%s", item), callback_data: `${id} ${callback_data}` }]
}

export const listWebsites = (response, options) => {
    try {
        const { currentPage, totalPages, websites } = response;
        const title = `${options.status ? "🔒" : "🌐"} Страница ${currentPage} из ${totalPages}`

        const content = totalPages < 1 ?
            [
                [{ text: "...", callback_data: "tmp " }]
            ]
            :
            websites.map(item => {
                const { id, url, isAlive } = item;
                return listItem(
                    url,
                    websitesService.getWebsiteSign(isAlive),
                    id,
                    "GWebsite"
                )
            });

        const [p, n] = listAcitions(currentPage, totalPages, "PWebsitePage", "NWebsitePage");


        const keyboard = Markup.inlineKeyboard([
            [{ text: cmd.addNewWebsite, callback_data: inlineCmd.addNewWebsite }],
            ...content,
            [
                p,
                { text: options.title, callback_data: inlineCmd.updateList },
                n,
            ]
        ]);
        return [title, keyboard];
    } catch (error) {
        console.error(error);
    }
}

export const listUsers = (response) => {
    try {
        const { currentPage, totalPages, users } = response;

        let title = "🧌 Тут пока пусто";
        let keyboard = null;

        if (totalPages === 0)
            return [title, keyboard];


        title = `Страница ${currentPage} из ${totalPages}`
        const content = users.map(item => {
            const { telegramId, username, access } = item;

            return listUserItem(
                username,
                userService.getUserSign(access),
                telegramId,
                "GUser"
            )
        });

        const [p, n] = listAcitions(currentPage, totalPages, "PUsersPage", "NUsersPage");

        keyboard = Markup.inlineKeyboard([
            ...content,
            [
                p,
                n,
            ]
        ]);
        return [title, keyboard];
    } catch (error) {
        console.error(error);
    }
}

export const usersInlineActions = (telegramId) => {
    return Markup.inlineKeyboard([
        { text: cmd.access[0], callback_data: `${telegramId} SUser 0` },
        { text: cmd.access[1], callback_data: `${telegramId} SUser 1` },
        { text: cmd.access[2], callback_data: `${telegramId} SUser 2` },
        { text: cmd.access[3], callback_data: `${telegramId} SUser 3` },
    ]);
};
