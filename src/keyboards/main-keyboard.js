import { Markup } from 'telegraf';
import { cmd } from '../utils/cmd.js';
import userService from '../services/userService.js';

export const UserKeyboard = async (telegramId) => {
    const user = await userService.getUser(telegramId);
    const level = user.access;

    if (level <= 1)
        return null;

    const accessLevels = [
        [
            [cmd.main],
            [cmd.websites]
        ],
        [
            [cmd.users]
        ]
    ]

    let buttons = [];
    for (let i = 0; i < level - 1; i++) {
        if (accessLevels[i]) {
            buttons = buttons.concat(accessLevels[i]);
        }
    }
    
    return Markup.keyboard(buttons).resize();
}

export const MainKeyboard = Markup.keyboard(
    [
        [cmd.main],
        [cmd.websites],
    ]
).resize();

export const BackInMainMenuKeyboard = Markup.keyboard(
    [
        [cmd.backInMainMenu]
    ]
).resize();

export const SceneUploadDataKeyboard = Markup.keyboard(
    [
        [cmd.saveSomething],
        [cmd.backInMainMenu],
    ]
).resize();