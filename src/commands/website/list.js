import { listWebsites } from "../../keyboards/inline-keyboard.js";
import websitesService from "../../services/websitesService.js";


const countInPage = 10;
export const getPrivateWebsitesList = async (ctx) => {
    await ctx.answerCbQuery();
    const telegramId = ctx.from.id;
    const res = await websitesService.getWebsitesByPage(1, countInPage, telegramId, { isAlive: true }, true);

    // status: true = private, false = public
    const [title, keyboard] = listWebsites(res, { title: "✅", where: {}, status: true });
    await ctx.reply(title, keyboard);
}

export const getPublicWebsitesList = async (ctx) => {
    await ctx.answerCbQuery();

    const res = await websitesService.getWebsitesByPage(1, countInPage, null, { isAlive: true }, true);

    const [title, keyboard] = listWebsites(res, { title: "✅", where: {}, status: false });
    await ctx.reply(title, keyboard);
}

const FilterEnum = {
    "✅": true,
    "⏳": null,
    "❌": false
};
const filter = Object.keys(FilterEnum);

/**
 * Функция для получения текущего и следующего фильтра
 */
const getNextFilter = (ctx) => {
    const currentFilter = ctx.update.callback_query.message.reply_markup.inline_keyboard
        .filter(e => e.length === 3)[0][1]?.text;

    const currentIndex = filter.indexOf(currentFilter);
    const nextIndex = (currentIndex + 1) % filter.length;

    return {
        currentFilter,
        currentFilterValue: FilterEnum[currentFilter], // Добавляем текущий фильтр и его значение
        nextFilter: filter[nextIndex],
        nextFilterValue: FilterEnum[filter[nextIndex]]
    };
};


export const anotherPageInWebsitesList = async (ctx) => {
    try {
        await ctx.answerCbQuery();
        const { id } = ctx.update.callback_query.from;


        const page = Number(ctx.match[0].split(' ')[0]) || 1;
        const { currentFilter, currentFilterValue } = getNextFilter(ctx);

        const privateStatus = ctx.update.callback_query.message.text.includes("🔒");
        const res = await websitesService.getWebsitesByPage(
            page,
            countInPage,
            privateStatus ? id : null,
            { isAlive: currentFilterValue },
            privateStatus
        );

        const [title, keyboard] = listWebsites(res, { title: currentFilter, status: privateStatus });

        await ctx.editMessageText(title, keyboard);
    } catch (error) {
        console.error("Ошибка в anotherPageInWebsitesList:", error);
    }
};



export const updateList = async (ctx) => {
    await ctx.answerCbQuery();
    const { id } = ctx.update.callback_query.from;

    const privateStatus = ctx.update.callback_query.message.text.includes("🔒");
    const { nextFilter, nextFilterValue } = getNextFilter(ctx);

    const res = await websitesService.getWebsitesByPage(
        1,
        countInPage,
        privateStatus ? id : null,
        { isAlive: nextFilterValue },
        privateStatus
    );

    const [title, keyboard] = listWebsites(res, { title: nextFilter, status: privateStatus });
    await ctx.editMessageText(title, keyboard);
};
