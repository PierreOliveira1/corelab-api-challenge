import database from '../../../src/database';

describe('Database', () => {
	it('should not error connection', () => {
		let error = false;
		database.authenticate().catch(() => {
			error = true;
		});
		expect(error).toBe(false);
		database.close();
	});
});
