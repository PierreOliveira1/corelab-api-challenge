import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Envs from '../../config/env';

const { JWT_SECRET } = Envs;

interface Decoded {
	id: string;
	email: string;
}

const checkToken = (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.headers.authorization)
			return res
				.status(401)
				.send({ error: true, message: 'No authorization provided' });

		if (!/^Bearer/gi.test(req.headers.authorization))
			return res
				.status(401)
				.send({ error: true, message: 'Poorly formatted authorization' });

		const auth = req.headers.authorization.split(' ');

		if (!auth[1])
			return res
				.status(401)
				.send({ error: true, message: 'No token provided' });

		const { id } = jwt.verify(auth[1], JWT_SECRET) as Decoded;

		res.locals.id = id;

		next();
	} catch (err) {
		return res.status(401).send({ error: true, message: 'Invalid token' });
	}
};

export default checkToken;
