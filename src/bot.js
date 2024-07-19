import dotenv from 'dotenv'; dotenv.config();
import { Telegraf } from 'telegraf';
import { start } from './commands/user.js';


const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const setupBot = () => {
    bot.command("start", start)

    return bot;
}

export default setupBot;