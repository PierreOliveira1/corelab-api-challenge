import User, { UserOptional } from '../../../../src/models/User';
import deleteUser from '../../../utils/deleteUser';
import isDateValid from '../../../utils/isDateValid';
import tokenValidate from '../../../utils/tokenValidate';
import uuidValidate from '../../../utils/uuidValidate';

describe('User model', () => {
	it('should create new user', async () => {
		const user: UserOptional = {
			firstName: 'Pierre',
			lastName: 'Oliveira',
			email: 'pierre.torres445@gmail.com',
			password: 'teste123',
			updatedAt: new Date(),
		};

		const user1 = await User.create(user);
		const comparePassword = user1.comparePassword(user.password);
		const token = user1.generateToken();

		expect(uuidValidate(user1.id)).toBeTruthy();
		expect(user1.firstName).toBe(user.firstName);
		expect(user1.lastName).toBe(user.lastName);
		expect(user1.email).toBe(user.email);
		expect(comparePassword).toBeTruthy();
		expect(tokenValidate(token, user1.id, user1.email)).toBeTruthy();
		expect(isDateValid(user1.createdAt)).toBeTruthy();
		expect(isDateValid(user1.updatedAt)).toBeTruthy();

		await deleteUser(user1.id);
	});
});
