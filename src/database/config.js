import Sequelize from "sequelize";
import dotenv from 'dotenv'; dotenv.config();

const config = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        logging: true, // dev
        define: {
            freezeTableName: true,
            timestamps: false
        },
        
    }
);

export default config;