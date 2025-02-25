import setupBot from './src/bot.js';
import sequelize from './src/database/config.js';
import initModels from "./src/database/models/relations.js"
import websitesService from './src/services/websitesService.js';
const models = initModels();

(async function () {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully!');           
        
        const bot = setupBot();
        bot.launch()
        setInterval(websitesService.conductAudit, 1 * 60 * 30 * 1000) // 30 min
        console.log("</ Bot launched successfully >")
    } catch (error) {
        console.error('Startup error: ', error)
    }
}())