import { Composer, Scenes } from "telegraf";
import {
    MainKeyboard,
    BackInMainMenuKeyboard,
    SceneUploadDataKeyboard
} from "../../keyboards/main-keyboard.js";
import { cmd } from "../../utils/cmd.js";
import websitesService from "../../services/websites-service.js";

const regexp = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/[^\s]*)?$/;

export const addNewWebsiteSceneEnterCallback = (ctx) => {
    ctx.answerCbQuery();
    ctx.scene.enter("addWebsite");
}

const stepDataInput = new Composer();
stepDataInput.on('text', async (ctx) => {
    const currentValue = ctx.update.message.text.split("\n");
    const error = [];

    currentValue.forEach(async item => {
        if (!regexp.test(item)) {
            error.push(item);
        }
    });

    if (error.length > 0) {
        await ctx.replyWithHTML(`Не валидная ссылка\n\n${JSON.stringify(error)}`);
        return ctx.wizard.selectStep(0);
    }

    ctx.scene.state.value = currentValue;
    await ctx.reply("Сохранить ?", SceneUploadDataKeyboard);
    return ctx.wizard.next();
});

const stepDataSave = new Composer();
stepDataSave.on('text', async (ctx) => {
    if (ctx.update.message.text === cmd.saveSomething) {
        ctx.scene.state.value.forEach(async item => {
            await websitesService.addWebsite(item);
        });
        await ctx.reply('Сохранено!');
        return ctx.scene.leave();
    } else {
        await ctx.reply('Отменено.');
        return ctx.scene.leave();
    }
});

export const addNewWebsiteScene = new Scenes.WizardScene(
    "addWebsite",
    stepDataInput,
    stepDataSave
);

addNewWebsiteScene.hears(cmd.backInMainMenu, async (ctx) => ctx.scene.leave());
addNewWebsiteScene.leave(async (ctx) => ctx.reply('Главное меню', MainKeyboard));
addNewWebsiteScene.enter(async (ctx) => await ctx.reply(`Введи ссылку\n\nможно несколько через перенос строки`, BackInMainMenuKeyboard));