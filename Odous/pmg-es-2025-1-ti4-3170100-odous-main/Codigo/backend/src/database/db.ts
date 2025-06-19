import { Sequelize } from "sequelize-typescript";
import path from 'path';

const database = new Sequelize({
    dialect: 'sqlite',
    storage: './src/database/database.sqlite',
    models: [path.join(__dirname, '..', 'models')]
});

/* const database = new Sequelize({
    dialect: 'postgres',
}); */

export default database;