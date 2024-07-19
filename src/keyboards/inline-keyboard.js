import { Markup } from "telegraf";
import { inlineCmd } from "../utils/cmd.js";

export const makeFromResponseInlineList = (response) => {
    try {
        let title = "";
        let keyboard = null;

        if (response.totalPages === 0) {
            title = "Тут пока пусто"
            keyboard = Markup.inlineKeyboard([{ text: "📝 Добавить", callback_data: inlineCmd.addNewWebsite }]);
            return [title, keyboard];
        }

        title = `Страница ${response.currentPage} из ${response.totalPages}`
        const content = response.websites.map(item => {
            return [{ text: item.url, callback_data: item.id }]
        });
        keyboard = Markup.inlineKeyboard([
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