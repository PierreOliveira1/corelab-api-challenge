import { Sequelize } from 'sequelize';
import Envs from '../config/env';

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST } = Envs;

const database = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
	dialect: 'mariadb',
	host: DB_HOST,
});

export default database;
