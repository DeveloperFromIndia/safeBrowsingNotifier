import sequelize from './src/database/config.js';



(async function () {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });

        // console.log("</ Bot launched successfully >")
    } catch (error) {
        console.error(error);
        // console.log('Startup error: ', error)
    }
}())