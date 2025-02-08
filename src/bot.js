import dotenv from 'dotenv'; dotenv.config();
import {
    Scenes,
    session,
    Telegraf
} from 'telegraf';
import { start } from './commands/main-commands.js';
import {
    anotherPageInWebsitesList,
    deleteWebsiteById,
    getWebsiteById,
    getWebsitesList,
    printAuditedList,
    showWebsitesList,
    toggleSubscription,
} from './commands/websites-commands.js';
import { cmd, inlineCmd } from './utils/cmd.js';
import {
    addNewWebsiteScene,
    addNewWebsiteSceneEnterCallback
} from './commands/scenes/websites-scenes.js';
import websitesService from './services/websitesService.js';


const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

export const sendMessageToUser = async ({ chatId, message, options }) => {
    try {
        await bot.telegram.sendMessage(chatId, message, options);
    } catch (error) {
        console.error(error);
    }
};

const stage = new Scenes.Stage([addNewWebsiteScene]);

const setupBot = () => {
    bot.use(session());
    bot.use(stage.middleware());

    bot.start(start);
    bot.hears(cmd.websites, getWebsitesList);
    bot.hears(cmd.main, start);

    // 
    bot.action(inlineCmd.addNewWebsite, addNewWebsiteSceneEnterCallback);
    bot.action(inlineCmd.getWebsiteInfoById, getWebsiteById);
    bot.action(inlineCmd.deleteWebsiteById, deleteWebsiteById);
    // 
    bot.action(inlineCmd.nextWebsitePage, anotherPageInWebsitesList);
    bot.action(inlineCmd.prevWebsitePage, anotherPageInWebsitesList);
    bot.action(inlineCmd.printAllWebsites, showWebsitesList);
    // 
    bot.action(inlineCmd.subscribeSite, toggleSubscription);
    bot.action(inlineCmd.unsubscribeSite, toggleSubscription);
    bot.action(inlineCmd.printAuditList, printAuditedList);
    bot.command("audit", websitesService.conductAudit);

    return bot;
}

export default setupBot;