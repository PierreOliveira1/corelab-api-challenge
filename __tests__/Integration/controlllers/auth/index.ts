import request from 'supertest';
import app from '../../../../src/app';
import { UserOptional, UserAttributes } from '../../../../src/models/User';
import isDateValid from '../../../utils/isDateValid';
import uuidValidate from '../../../utils/uuidValidate';
import tokenValidate from '../../../utils/tokenValidate';
import deleteUser from '../../../utils/deleteUser';

describe('Route auth', () => {
	const newUser: UserOptional = {
		firstName: 'Pierre',
		lastName: 'Oliveira',
		email: 'pierre.torres445@gmail.com',
		password: '123456789',
		updatedAt: new Date(),
	};

	interface ResBody {
		user: UserAttributes;
		token: string;
	}

	it('should create new user', async () => {
		const res = await request(app).post('/auth/signup').send(newUser);
		const { user, token } = res.body as ResBody;

		expect(res.statusCode).toEqual(201);
		expect(uuidValidate(user.id)).toBeTruthy();
		expect(user.firstName).toBe(newUser.firstName);
		expect(user.lastName).toBe(newUser.lastName);
		expect(user.email).toBe(newUser.email);
		expect(isDateValid(new Date(user.createdAt))).toBeTruthy();
		expect(isDateValid(new Date(user.updatedAt))).toBeTruthy();
		expect(tokenValidate(token, user.id, user.email)).toBeTruthy();

		await deleteUser(user.id);
	});
});
