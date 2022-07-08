import request from 'supertest';

import app from '../../../../src/app';
import Vehicle, {
	VehicleAttributes,
	VehicleAttributesOptional,
} from '../../../../src/models/Vehicle';
import isDateValid from '../../../utils/isDateValid';
import uuidValidate from '../../../utils/uuidValidate';
import deleteVehicle from '../../../utils/deleteVehicle';

describe('Route vehicle', () => {
	const vehicle: VehicleAttributesOptional = {
		name: 'Uno',
		brand: 'Fiat',
		color: 'Rosa',
		year: 2010,
		board: 'ABC1235',
	};

	it('should add new vehicle', async () => {
		const res = await request(app).post('/vehicle/add').send(vehicle);

		const resBody: VehicleAttributes = res.body;

		expect(res.statusCode).toEqual(200);
		expect(uuidValidate(resBody.id)).toBeTruthy();
		expect(resBody.name).toBe(vehicle.name);
		expect(resBody.brand).toBe(vehicle.brand);
		expect(resBody.color).toBe(vehicle.color);
		expect(resBody.year).toBe(vehicle.year);
		expect(resBody.board).toBe(vehicle.board);
		expect(isDateValid(new Date(resBody.createdAt))).toBeTruthy();
		expect(isDateValid(new Date(resBody.updatedAt))).toBeTruthy();

		await deleteVehicle(resBody.id);
	});

	it('should error vehicle already exists', async () => {
		const vehicle1: VehicleAttributes = await Vehicle.create(vehicle);
		const res = await request(app).post('/vehicle/add').send(vehicle);

		type ErrorBody = {
			error: boolean;
			message: string;
		};

		const resBody: ErrorBody = res.body;

		expect(res.statusCode).toEqual(400);
		expect(resBody.error).toBeTruthy();
		expect(resBody.message).toBe('This board already exists');

		await deleteVehicle(vehicle1.id);
	});
});
