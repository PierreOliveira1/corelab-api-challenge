import app from './app';

import Envs from './config/env';

const { PORT } = Envs;

app.listen(PORT);
