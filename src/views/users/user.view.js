import userService from "../../services/userService.js";
import websitesService from "../../services/websitesService.js";

export const userView = async (userId, username, access) => {
    const [active, inactive, underInspection, total] = await websitesService.getDomainOverview(userId);
    return `
    👤 Пользователь: ${"@" + username || "Неизвестный"}(${userId}) ${access}\n
📁 Всего доменов: ${total}
✅ Активные домены: ${active} — работают без проблем!
❌ Неактивные домены: ${inactive} — возможно, требуется проверка.
⏳ Доменов на проверке: ${underInspection} — скоро узнаем их статус.
    `
}