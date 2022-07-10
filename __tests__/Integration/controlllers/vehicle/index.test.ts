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
		updatedAt: new Date(),
	};

	it('should add new vehicle', async () => {
		const res = await request(app).post('/vehicle/add').send(vehicle);

		const resBody: VehicleAttributes = res.body;

		expect(res.statusCode).toEqual(201);
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

	it('should get all vehicles', async () => {
		await Vehicle.truncate();
		const vehicle1: VehicleAttributes = await Vehicle.create({
			name: vehicle.name,
			brand: vehicle.brand,
			color: vehicle.color,
			year: 2010,
			board: 'ABC987645',
			updatedAt: vehicle.updatedAt,
		});
		const vehicle2: VehicleAttributes = await Vehicle.create({
			name: vehicle.name,
			brand: vehicle.brand,
			color: vehicle.color,
			year: 2011,
			board: 'ABC5432456',
			updatedAt: vehicle.updatedAt,
		});
		const vehicle3: VehicleAttributes = await Vehicle.create({
			name: vehicle.name,
			brand: vehicle.brand,
			color: vehicle.color,
			year: 2012,
			board: 'ABC1239456',
			updatedAt: vehicle.updatedAt,
		});

		const res = await request(app).get('/vehicle/all');
		const resB: VehicleAttributes[] = res.body;
		const resBody: VehicleAttributes[] = resB.sort((a, b) => {
			if (a.year > b.year) return 1;
			if (a.year < b.year) return -1;
			return 0;
		});

		expect(res.statusCode).toEqual(200);

		// vehicle1
		expect(uuidValidate(resBody[0].id)).toBeTruthy();
		expect(resBody[0].name).toBe(vehicle1.name);
		expect(resBody[0].brand).toBe(vehicle1.brand);
		expect(resBody[0].color).toBe(vehicle1.color);
		expect(resBody[0].year).toBe(vehicle1.year);
		expect(resBody[0].board).toBe(vehicle1.board);
		expect(isDateValid(new Date(resBody[0].createdAt))).toBeTruthy();
		expect(isDateValid(new Date(resBody[0].updatedAt))).toBeTruthy();

		// vehicle2
		expect(uuidValidate(resBody[1].id)).toBeTruthy();
		expect(resBody[1].name).toBe(vehicle2.name);
		expect(resBody[1].brand).toBe(vehicle2.brand);
		expect(resBody[1].color).toBe(vehicle2.color);
		expect(resBody[1].year).toBe(vehicle2.year);
		expect(resBody[1].board).toBe(vehicle2.board);
		expect(isDateValid(new Date(resBody[1].createdAt))).toBeTruthy();
		expect(isDateValid(new Date(resBody[1].updatedAt))).toBeTruthy();

		// vehicle3
		expect(uuidValidate(resBody[2].id)).toBeTruthy();
		expect(resBody[2].name).toBe(vehicle3.name);
		expect(resBody[2].brand).toBe(vehicle3.brand);
		expect(resBody[2].color).toBe(vehicle3.color);
		expect(resBody[2].year).toBe(vehicle3.year);
		expect(resBody[2].board).toBe(vehicle3.board);
		expect(isDateValid(new Date(resBody[2].createdAt))).toBeTruthy();
		expect(isDateValid(new Date(resBody[2].updatedAt))).toBeTruthy();

		await deleteVehicle(vehicle1.id);
		await deleteVehicle(vehicle2.id);
		await deleteVehicle(vehicle3.id);
	});

	it('should update vehicle', async () => {
		const vehicle1 = await Vehicle.create(vehicle);

		const res = await request(app).put(`/vehicle/update/${vehicle1.id}`).send({
			name: 'Siena',
			color: 'Verde',
		});

		interface ResBody {
			updated: boolean;
		}
		const { updated }: ResBody = res.body;

		const getVehicle = await Vehicle.findOne({ where: { id: vehicle1.id } });

		expect(res.statusCode).toEqual(200);
		expect(updated).toBeTruthy();
		expect(getVehicle?.id).toBe(vehicle1.id);
		expect(getVehicle?.brand).toBe(vehicle1.brand);
		expect(getVehicle?.name).toBe('Siena');
		expect(getVehicle?.color).toBe('Verde');
		expect(getVehicle?.board).toBe(vehicle1.board);
		expect(new Date(getVehicle?.createdAt as Date).toLocaleString()).toBe(
			new Date(vehicle1.createdAt).toLocaleString()
		);
		expect(new Date(getVehicle?.updatedAt as Date)).not.toBe(
			new Date(vehicle1.updatedAt)
		);

		await deleteVehicle(vehicle1.id);
	});

	it('should not update vehicle id and createAt', async () => {
		const vehicle1 = await Vehicle.create(vehicle);

		const res = await request(app).put(`/vehicle/update/${vehicle1.id}`).send({
			id: 'Pierre',
			createdAt: new Date(),
		});

		interface ResBody {
			updated: boolean;
		}

		const { updated }: ResBody = res.body;

		const getVehicle = await Vehicle.findOne({ where: { id: vehicle1.id } });

		expect(res.statusCode).toEqual(200);
		expect(updated).not.toBeTruthy();
		expect(getVehicle?.id).toBe(vehicle1.id);
		expect(new Date(getVehicle?.createdAt as Date).toLocaleString()).toBe(
			new Date(vehicle1.createdAt).toLocaleString()
		);

		await deleteVehicle(vehicle1.id);
	});

	it('should delete vehicle', async () => {
		const vehicle1 = await Vehicle.create(vehicle);

		const res = await request(app).delete(`/vehicle/delete/${vehicle1.id}`);

		interface ResBody {
			deleted: boolean;
		}

		const { deleted }: ResBody = res.body;

		expect(res.statusCode).toEqual(200);
		expect(deleted).toBeTruthy();
	});
});
