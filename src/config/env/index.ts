import { config } from 'dotenv';
import path from 'path';

config({
	path: path.join(
		__dirname,
		'../../../',
		process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
	),
});

interface IEnvs {
	PORT: number;
	ALLOWED_ORIGINS: string[];
	DB_HOST: string;
	DB_PORT: number | undefined;
	DB_NAME: string;
	DB_USERNAME: string;
	DB_PASSWORD: string;
	JWT_SECRET: string;
}

const Envs: IEnvs = {
	PORT: Number(process.env.PORT),
	ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(';') as string[],
	DB_HOST: `${process.env.DB_HOST}`,
	DB_PORT:
		Number(process.env.DB_PORT) === 0 ? undefined : Number(process.env.DB_PORT),
	DB_NAME: `${process.env.DB_NAME}`,
	DB_USERNAME: `${process.env.DB_USERNAME}`,
	DB_PASSWORD: `${process.env.DB_PASSWORD}`,
	JWT_SECRET: `${process.env.JWT_SECRET}`,
};

export default Envs;
