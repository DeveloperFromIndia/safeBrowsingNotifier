import setupBot from './src/bot.js';
import sequelize from './src/database/config.js';
import initModels from "./src/database/models/relations.js"

const models = initModels();

(async function () {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });

        const bot = setupBot();
        bot.launch();

        console.log("</ Bot launched successfully >")
    } catch (error) {
        console.log('Startup error: ', error)
    }
}())