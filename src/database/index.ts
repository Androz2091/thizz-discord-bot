import { Sequelize } from 'sequelize';
export const database = new Sequelize({
    dialect: 'postgres',
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
});

