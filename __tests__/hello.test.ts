import request from 'supertest';

import app from '../src/app';

describe('Route testing', () => {
	it('Hello World', async () => {
		const res = await request(app).get('/');

		expect(res.status).toEqual(200);
		expect(res.body).toHaveProperty('message', 'Hello World!');
	});
});
