import { Markup } from 'telegraf';

const cmdText = {
    sites: "Сайты",
    settings: "Настройки",
}

export const MainKeyboard = Markup.keyboard(
    [
        [cmdText.sites],
        [cmdText.settings]
    ]
).resize();
