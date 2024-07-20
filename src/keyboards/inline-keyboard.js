import { Markup } from "telegraf";
import { cmd, inlineCmd } from "../utils/cmd.js";

export const makeFromResponseInlineList = (response) => {
    try {
        let title = "";
        let keyboard = null;

        if (response.totalPages === 0) {
            title = "Тут пока пусто"
            keyboard = Markup.inlineKeyboard([{ text: cmd.addNewWebsite, callback_data: inlineCmd.addNewWebsite }]);
            return [title, keyboard];
        }

        title = `Страница ${response.currentPage} из ${response.totalPages}`
        const content = response.websites.map(item => {
            let sign = "";
            switch (item.isAlive) {
                case true:
                    sign = "✅"
                    break
                case false:
                    sign = "❌"
                    break
                case null:
                    sign = "⏳"
            }
            return [{ text: `${item.url} - ${sign}`, callback_data: `${item.id} GWebsite` }]
        });
        keyboard = Markup.inlineKeyboard([
            [{ text: cmd.addNewWebsite, callback_data: inlineCmd.addNewWebsite }],
            ...content,
            [
                { text: `${response.currentPage - 1 <= 0 ? '⏺' : '⬅️'}`, callback_data: "prev" },
                { text: '⏬', callback_data: "all" },
                { text: `${response.currentPage + 1 > response.totalPages ? '⏺' : '➡️'}`, callback_data: "next" },
            ]
        ]);
        return [title, keyboard];
    } catch (error) {
        console.error(error);
    }
}
