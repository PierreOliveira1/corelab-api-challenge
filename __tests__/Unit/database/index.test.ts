import database from '../../../src/database';

describe('Database', () => {
	it('should not error connection', async () => {
		let error = false;
		try {
			await database.authenticate();
		} catch (err) {
			error = true;
		}

		expect(error).toBe(false);
		database.close();
	});
});
