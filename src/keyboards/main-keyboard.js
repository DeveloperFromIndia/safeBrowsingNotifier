import { Markup } from 'telegraf';
import { cmd } from '../utils/cmd.js';

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