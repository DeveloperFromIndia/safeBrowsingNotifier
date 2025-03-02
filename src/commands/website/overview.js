import { Markup } from "telegraf"; // Убедись, что импортируешь Markup
import websitesService from "../../services/websitesService.js";
import { cmd, inlineCmd } from "../../utils/cmd.js";

const overviewMessageInlineKeyboard = Markup.inlineKeyboard([
    [
        Markup.button.callback("🔍 Поиск", inlineCmd.searchWebsite),
    ],
    [
        Markup.button.callback("📁 Мои домены", inlineCmd.website.privateList),
        Markup.button.callback("🌐 Публичные домены", inlineCmd.website.publicList),
    ],
]);

export const websiteOverview = async (ctx) => {
    const { id } = ctx.message.from;

    const [active, inactive, underInspection, total] = await websitesService.getDomainOverview(id);

    const title = `📊 Статистика ваших доменов:
📁 Всего: ${total} доменов в системе.

✅ Активные: ${active} — работают без проблем!  
❌ Неактивные: ${inactive} — возможно, требуется проверка.  
⏳ На проверке: ${underInspection} — скоро узнаем их статус.  

🚀 Следите за изменениями, и не забывайте проверять важные домены!`;

    return ctx.reply(title, overviewMessageInlineKeyboard);
};
