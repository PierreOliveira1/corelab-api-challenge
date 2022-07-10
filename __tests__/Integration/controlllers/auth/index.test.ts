import request from 'supertest';
import app from '../../../../src/app';
import User, {
	UserOptional,
	UserAttributes,
} from '../../../../src/models/User';
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
		error: boolean;
		message: string;
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

	it('should error this user already exists', async () => {
		const user1 = await User.create(newUser);

		const res = await request(app).post('/auth/signup').send(newUser);

		const { error, message }: ResBody = res.body;

		expect(res.statusCode).toEqual(400);
		expect(error).toBeTruthy();
		expect(message).toBe('This user already exists');

		await deleteUser(user1.id);
	});

	it('should signin user', async () => {
		const user1 = await User.create(newUser);
		const res = await request(app)
			.post('/auth/signin')
			.send({ email: newUser.email, password: newUser.password });

		const { user, token }: ResBody = res.body;

		expect(res.statusCode).toEqual(200);
		expect(user1.id).toBe(user.id);
		expect(user1.firstName).toBe(user.firstName);
		expect(user1.lastName).toBe(user.lastName);
		expect(user1.email).toBe(user.email);
		expect(isDateValid(new Date(user.createdAt))).toBeTruthy();
		expect(isDateValid(new Date(user.updatedAt))).toBeTruthy();
		expect(tokenValidate(token, user.id, user.email)).toBeTruthy();

		await deleteUser(user1.id);
	});

	it('should error this user does not exist', async () => {
		await User.truncate();
		const res = await request(app)
			.post('/auth/signin')
			.send({ email: newUser.email, password: newUser.password });

		const { error, message }: ResBody = res.body;

		expect(res.statusCode).toEqual(404);
		expect(error).toBeTruthy();
		expect(message).toBe('This user does not exist');
	});

	it('should error password invalid', async () => {
		const user1 = await User.create(newUser);
		const res = await request(app)
			.post('/auth/signin')
			.send({ email: newUser.email, password: 'teste' });

		const { error, message }: ResBody = res.body;

		expect(res.statusCode).toEqual(401);
		expect(error).toBeTruthy();
		expect(message).toBe('Password invalid');

		await deleteUser(user1.id);
	});
});
