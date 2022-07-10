import jwt from 'jsonwebtoken';
import Envs from '../../../src/config/env';

const { JWT_SECRET } = Envs;

interface Decoded {
	id: string;
	email: string;
}

function tokenValidate(token: string, id: string, email: string) {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as Decoded;
		if (decoded?.id === id && decoded?.email === email) return true;
	} catch (err) {
		return false;
	}
}

export default tokenValidate;
