import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// Config
import corsOptions from './config/cors';

// Routes
import Routes from './routes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(Routes);

app.get('/', (req, res) => {
	res.send({ message: 'Hello World!' });
});

export default app;
