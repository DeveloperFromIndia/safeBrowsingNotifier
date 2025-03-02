import dotenv from 'dotenv'; dotenv.config();
import {
    Scenes,
    session,
    Telegraf
} from 'telegraf';

// utils
import { cmd, inlineCmd } from './utils/cmd.js';

// services
import websitesService from './services/websitesService.js';
// commands
import { 
    anotherPageInUserList, 
    changeUserAccessById, 
    getUserById, 
    getUsersList 
} from './commands/user-command.js';
import { start } from './commands/main-commands.js';
import {
    deleteWebsiteById,
    getWebsiteById,
    printAuditedList,
    toggleSubscription,
} from './commands/websites-commands.js';
import { websiteOverview } from './commands/website/overview.js';
// middleware
import accessMiddleware from './middleware/access.midleware.js';
// scenes
import {
    addNewWebsiteScene,
    addNewWebsiteSceneEnterCallback
} from './commands/website/scenes/add.scenes.js';
import { 
    searchWebsiteScene, 
    searchWebsiteSceneEnterCallback 
} from './commands/website/scenes/search.scenes.js';
import { anotherPageInWebsitesList, getPrivateWebsitesList, getPublicWebsitesList, updateList } from './commands/website/list.js';


const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

export const sendMessageToUser = async ({ chatId, message, options }) => {
    try {
        await bot.telegram.sendMessage(chatId, message, options);
    } catch (error) {
        console.error(error);
    }
};

const stage = new Scenes.Stage([addNewWebsiteScene, searchWebsiteScene]);

const setupBot = () => {
    bot.use(session());
    bot.use(stage.middleware());

    bot.start(start);
    bot.hears(cmd.websites.title, accessMiddleware(2), websiteOverview);
    // list
    bot.action(inlineCmd.website.privateList, accessMiddleware(2), getPrivateWebsitesList);
    bot.action(inlineCmd.website.publicList, accessMiddleware(2), getPublicWebsitesList);
    bot.hears(cmd.users, accessMiddleware(3), getUsersList);
    
    // website actions
    bot.action(inlineCmd.addNewWebsite, accessMiddleware(2), addNewWebsiteSceneEnterCallback);
    bot.action(inlineCmd.searchWebsite, accessMiddleware(2), searchWebsiteSceneEnterCallback);
    bot.action(inlineCmd.getWebsiteInfoById, accessMiddleware(2), getWebsiteById);
    bot.action(inlineCmd.deleteWebsiteById, accessMiddleware(2), deleteWebsiteById);
    // users actions
    bot.action(inlineCmd.getUserInfoById, accessMiddleware(3), getUserById);
    bot.action(inlineCmd.setRole, accessMiddleware(3), changeUserAccessById);
    // users list 
    bot.action(inlineCmd.nextUserPage, accessMiddleware(3), anotherPageInUserList);
    bot.action(inlineCmd.prevUserPage, accessMiddleware(3), anotherPageInUserList);

    bot.action(inlineCmd.nextWebsitePage, accessMiddleware(2), anotherPageInWebsitesList);
    bot.action(inlineCmd.prevWebsitePage, accessMiddleware(2), anotherPageInWebsitesList);
    bot.action(inlineCmd.updateList, accessMiddleware(2), updateList);
    // 
    bot.action(inlineCmd.subscribeSite, accessMiddleware(2), toggleSubscription);
    bot.action(inlineCmd.unsubscribeSite, accessMiddleware(2), toggleSubscription);
    bot.action(inlineCmd.printAuditList, accessMiddleware(2), printAuditedList);
    // 
    bot.command("audit", accessMiddleware(3), websitesService.conductAudit);

    return bot;
}

export default setupBot;