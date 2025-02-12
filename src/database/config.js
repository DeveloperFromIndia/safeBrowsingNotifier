import Sequelize from "sequelize";
import dotenv from 'dotenv'; dotenv.config();

const config = new Sequelize(
    {
        dialect: 'sqlite',
        storage: 'src/database/cartel.sqlite',
        logging: false, // dev
        force: false,
        define: {
            freezeTableName: true,
            timestamps: false,
        },
        
    }
);

export default config;