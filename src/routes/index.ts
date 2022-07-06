import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const Routes = Router();

fs.readdirSync(path.join(__dirname, '../controllers')).forEach((dir: string) => {
	const Controller = require(`../controllers/${dir}`);
	Routes.use(`/${dir}`, Controller.default);
});

export default Routes;
