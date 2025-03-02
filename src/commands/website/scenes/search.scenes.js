import { Composer, Scenes } from "telegraf";
import {
    MainKeyboard,
    BackInMainMenuKeyboard,
    SceneUploadDataKeyboard,
    UserKeyboard
} from "../../../keyboards/main-keyboard.js";
import websitesService from "../../../services/websitesService.js";
import { websiteView } from "../../../views/website/website.view.js";
import { cmd, inlineCmd } from "../../../utils/cmd.js";
import userService from "../../../services/userService.js";
import { websiteInlineActions } from "../../../keyboards/inline-keyboard.js";

export const searchWebsiteSceneEnterCallback = async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.scene.enter("find_domain");
}

const stepDataInput = new Composer();
stepDataInput.on('text', async (ctx) => {

    const currentValue = ctx.update.message.text.split("\n");

    ctx.scene.state.value = currentValue;
    await ctx.reply("Поиск...");

    ctx.wizard.next(); // Переход к следующему шагу
    return ctx.wizard.step.handler(ctx);
    // return ctx.wizard.next();
});

const stepDataFind = new Composer();
stepDataFind.on('text', async (ctx) => {
    const { id, username } = ctx.message.from;
    await userService.firstStart(id, username);

    let err = [];

    for (const item of ctx.scene.state.value) {
        const clause = isNaN(Number(item)) ? { url: item } : { id: Number(item) };
        const website = await websitesService.getWebsiteBySomething(clause);

        if (website) {
            const sign = websitesService.getWebsiteSign(website.isAlive);
            const keyboard = websiteInlineActions({
                websiteId: website.id,
                permissions: [website.telegramId == id ? "holder" : "public"]
            });
            await ctx.reply(websiteView({ id: website.id, sign, url: website.url }), keyboard);
        } else {
            err.push(item);
        }
    }

    if (err.length > 0) {
        await ctx.reply(`❌ Не найдено:\n${err.map(e => `- ${e}`).join("\n")}`);
    } 

    return ctx.scene.leave();
});


export const searchWebsiteScene = new Scenes.WizardScene(
    "find_domain",
    stepDataInput,
    stepDataFind
);

searchWebsiteScene.hears("/start", async (ctx) => ctx.scene.leave()); 
searchWebsiteScene.leave(async (ctx) => await ctx.reply('Поиск завершен ✅', await UserKeyboard(ctx.from.id)));
searchWebsiteScene.hears(cmd.backInMainMenu, async (ctx) => ctx.scene.leave());
searchWebsiteScene.enter(async (ctx) => await ctx.reply("📌 Введите ссылку на домен или его ID\n\n🔹 Можно указать несколько значений, разделяя их новой строкой.", BackInMainMenuKeyboard));