import { CorsOptions } from 'cors';
import Envs from '../env';

const { ALLOWED_ORIGINS } = Envs;

const corsOptions: CorsOptions = {
	origin: ALLOWED_ORIGINS,
};

export default corsOptions;
