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
import { anotherPageInUserList, changeUserAccessById, getUserById, getUsersList } from './commands/user-command.js';
import accessMiddleware from './middleware/access.midleware.js';


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
    bot.hears(cmd.websites, accessMiddleware(2), getWebsitesList);
    bot.hears(cmd.main, accessMiddleware(2), start);
    bot.hears(cmd.users, accessMiddleware(3), getUsersList)

    // website actions
    bot.action(inlineCmd.addNewWebsite, accessMiddleware(2), addNewWebsiteSceneEnterCallback);
    bot.action(inlineCmd.getWebsiteInfoById, accessMiddleware(2), getWebsiteById);
    bot.action(inlineCmd.deleteWebsiteById, accessMiddleware(2), deleteWebsiteById);
    // users actions
    bot.action(inlineCmd.getUserInfoById, accessMiddleware(3), getUserById);
    bot.action(inlineCmd.setRole, accessMiddleware(3), changeUserAccessById);
    // users list 
    bot.action(inlineCmd.nextUserPage, accessMiddleware(3), anotherPageInUserList);
    bot.action(inlineCmd.prevUserPage, accessMiddleware(3), anotherPageInUserList);
    // website list 
    bot.action(inlineCmd.nextWebsitePage, accessMiddleware(2), anotherPageInWebsitesList);
    bot.action(inlineCmd.prevWebsitePage, accessMiddleware(2), anotherPageInWebsitesList);
    bot.action(inlineCmd.printAllWebsites, accessMiddleware(2), showWebsitesList);
    // 
    bot.action(inlineCmd.subscribeSite, accessMiddleware(2), toggleSubscription);
    bot.action(inlineCmd.unsubscribeSite, accessMiddleware(2), toggleSubscription);
    bot.action(inlineCmd.printAuditList, accessMiddleware(2), printAuditedList);
    // 
    bot.command("audit", accessMiddleware(3), websitesService.conductAudit);

    return bot;
}

export default setupBot;