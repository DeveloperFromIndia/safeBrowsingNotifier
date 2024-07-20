import setupBot from './src/bot.js';
import sequelize from './src/database/config.js';
import initModels from "./src/database/models/relations.js"
import websitesService from './src/services/websites-service.js';

const models = initModels();
(async function () {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });

        const bot = setupBot();
        bot.launch();
 
        setInterval(websitesService.conductAudit, 1 * 60 * 60 * 1000)
        console.log("</ Bot launched successfully >")
    } catch (error) {
        console.error('Startup error: ', error)
    }
}())