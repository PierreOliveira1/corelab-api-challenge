import request from 'supertest';

import app from '../../../../src/app';
import Vehicle, {
	VehicleAttributes,
	VehicleAttributesOptional,
} from '../../../../src/models/Vehicle';
import User, { UserOptional } from '../../../../src/models/User';
import isDateValid from '../../../utils/isDateValid';
import uuidValidate from '../../../utils/uuidValidate';
import deleteVehicle from '../../../utils/deleteVehicle';
import deleteUser from '../../../utils/deleteUser';

describe('Route vehicle', () => {
	const user: UserOptional = {
		firstName: 'Pierre',
		lastName: 'Oliveira',
		email: 'pierre@gmail.com',
		password: '123456789',
		updatedAt: new Date(),
	};

	const vehicle: VehicleAttributesOptional = {
		name: 'Uno',
		description: 'Novo zero km',
		brand: 'Fiat',
		color: 'Rosa',
		year: 2010,
		board: 'ABC1235',
		price: 10000.0,
		updatedAt: new Date(),
	};

	it('should add new vehicle', async () => {
		const user1 = await User.create(user);
		const res = await request(app)
			.post('/vehicle/add')
			.set('Authorization', `Bearer ${user1.generateToken()}`)
			.send(vehicle);

		const resBody: VehicleAttributes = res.body;

		expect(res.statusCode).toEqual(201);
		expect(uuidValidate(resBody.id)).toBeTruthy();
		expect(resBody.name).toBe(vehicle.name);
		expect(resBody.description).toBe(vehicle.description);
		expect(resBody.brand).toBe(vehicle.brand);
		expect(resBody.color).toBe(vehicle.color);
		expect(resBody.year).toBe(vehicle.year);
		expect(resBody.board).toBe(vehicle.board);
		expect(resBody.price).toBe(vehicle.price);
		expect(isDateValid(new Date(resBody.createdAt))).toBeTruthy();
		expect(isDateValid(new Date(resBody.updatedAt))).toBeTruthy();

		await deleteVehicle(resBody.id);
		await deleteUser(user1.id);
	});

	it('should error vehicle already exists', async () => {
		const user1 = await User.create(user);
		const vehicle1: VehicleAttributes = await Vehicle.create({
			...vehicle,
			userId: user1.id,
		});
		const res = await request(app)
			.post('/vehicle/add')
			.set('Authorization', `Bearer ${user1.generateToken()}`)
			.send(vehicle);

		type ErrorBody = {
			error: boolean;
			message: string;
		};

		const resBody: ErrorBody = res.body;

		expect(res.statusCode).toEqual(400);
		expect(resBody.error).toBeTruthy();
		expect(resBody.message).toBe('This board already exists');

		await deleteVehicle(vehicle1.id);
		await deleteUser(user1.id);
	});

	it('should get all vehicles', async () => {
		const user1 = await User.create(user);
		await Vehicle.truncate();
		const vehicle1: VehicleAttributes = await Vehicle.create({
			...vehicle,
			year: 2010,
			board: 'ABC987645',
			userId: user1.id,
		});
		const vehicle2: VehicleAttributes = await Vehicle.create({
			...vehicle,
			year: 2011,
			board: 'ABC5432456',
			userId: user1.id,
		});
		const vehicle3: VehicleAttributes = await Vehicle.create({
			...vehicle,
			year: 2012,
			board: 'ABC1239456',
			userId: user1.id,
		});

		const res = await request(app)
			.get('/vehicle/all')
			.set('Authorization', `Bearer ${user1.generateToken()}`);
		const resB: VehicleAttributes[] = res.body;
		const resBody: VehicleAttributes[] = resB.sort((a, b) => {
			if (a.year > b.year) return 1;
			if (a.year < b.year) return -1;
			return 0;
		});

		expect(res.statusCode).toEqual(200);

		// vehicle1
		expect(uuidValidate(resBody[0].id)).toBeTruthy();
		expect(uuidValidate(resBody[0].userId)).toBeTruthy();
		expect(resBody[0].name).toBe(vehicle1.name);
		expect(resBody[0].description).toBe(vehicle1.description);
		expect(resBody[0].brand).toBe(vehicle1.brand);
		expect(resBody[0].color).toBe(vehicle1.color);
		expect(resBody[0].year).toBe(vehicle1.year);
		expect(resBody[0].board).toBe(vehicle1.board);
		expect(resBody[0].price).toBe(vehicle1.price);
		expect(isDateValid(new Date(resBody[0].createdAt))).toBeTruthy();
		expect(isDateValid(new Date(resBody[0].updatedAt))).toBeTruthy();

		// vehicle2
		expect(uuidValidate(resBody[1].id)).toBeTruthy();
		expect(uuidValidate(resBody[0].userId)).toBeTruthy();
		expect(resBody[1].name).toBe(vehicle2.name);
		expect(resBody[1].description).toBe(vehicle2.description);
		expect(resBody[1].brand).toBe(vehicle2.brand);
		expect(resBody[1].color).toBe(vehicle2.color);
		expect(resBody[1].year).toBe(vehicle2.year);
		expect(resBody[1].board).toBe(vehicle2.board);
		expect(resBody[1].price).toBe(vehicle2.price);
		expect(isDateValid(new Date(resBody[1].createdAt))).toBeTruthy();
		expect(isDateValid(new Date(resBody[1].updatedAt))).toBeTruthy();

		// vehicle3
		expect(uuidValidate(resBody[2].id)).toBeTruthy();
		expect(uuidValidate(resBody[0].userId)).toBeTruthy();
		expect(resBody[2].name).toBe(vehicle3.name);
		expect(resBody[2].description).toBe(vehicle3.description);
		expect(resBody[2].brand).toBe(vehicle3.brand);
		expect(resBody[2].color).toBe(vehicle3.color);
		expect(resBody[2].year).toBe(vehicle3.year);
		expect(resBody[2].board).toBe(vehicle3.board);
		expect(resBody[2].price).toBe(vehicle3.price);
		expect(isDateValid(new Date(resBody[2].createdAt))).toBeTruthy();
		expect(isDateValid(new Date(resBody[2].updatedAt))).toBeTruthy();

		await deleteVehicle(vehicle1.id);
		await deleteVehicle(vehicle2.id);
		await deleteVehicle(vehicle3.id);
		await deleteUser(user1.id);
	});

	it('should update vehicle', async () => {
		const user1 = await User.create(user);
		const vehicle1 = await Vehicle.create({
			...vehicle,
			userId: user1.id,
		});

		const res = await request(app)
			.put(`/vehicle/update/${vehicle1.id}`)
			.set('Authorization', `Bearer ${user1.generateToken()}`)
			.send({
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
		expect(getVehicle?.userId).toBe(user1.id);
		expect(getVehicle?.brand).toBe(vehicle1.brand);
		expect(getVehicle?.name).toBe('Siena');
		expect(getVehicle?.description).toBe(vehicle1.description);
		expect(getVehicle?.color).toBe('Verde');
		expect(getVehicle?.board).toBe(vehicle1.board);
		expect(getVehicle?.price).toBe(vehicle1.price);
		expect(new Date(getVehicle?.createdAt as Date).toLocaleString()).toBe(
			new Date(vehicle1.createdAt).toLocaleString()
		);
		expect(new Date(getVehicle?.updatedAt as Date)).not.toBe(
			new Date(vehicle1.updatedAt)
		);

		await deleteVehicle(vehicle1.id);
		await deleteUser(user1.id);
	});

	it('should not update vehicle id and createAt', async () => {
		const user1 = await User.create(user);
		const vehicle1 = await Vehicle.create({
			...vehicle,
			userId: user1.id,
		});

		const res = await request(app)
			.put(`/vehicle/update/${vehicle1.id}`)
			.set('Authorization', `Bearer ${user1.generateToken()}`)
			.send({
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
		await deleteUser(user1.id);
	});

	it('should delete vehicle', async () => {
		const user1 = await User.create(user);
		const vehicle1 = await Vehicle.create({
			...vehicle,
			userId: user1.id,
		});

		const res = await request(app)
			.delete(`/vehicle/delete/${vehicle1.id}`)
			.set('Authorization', `Bearer ${user1.generateToken()}`);

		interface ResBody {
			deleted: boolean;
		}

		const { deleted }: ResBody = res.body;

		expect(res.statusCode).toEqual(200);
		expect(deleted).toBeTruthy();

		await deleteUser(user1.id);
	});

	it('should get my vehicles', async () => {
		const user1 = await User.create(user);
		const user2 = await User.create({
			...user,
			email: 'teste@gmail.com',
		});
		const vehicle1 = await Vehicle.create({
			...vehicle,
			userId: user1.id,
		});
		const vehicle2 = await Vehicle.create({
			...vehicle,
			userId: user1.id,
			board: 'AAAAAA',
			year: 2011,
		});
		const vehicle3 = await Vehicle.create({
			...vehicle,
			userId: user2.id,
			board: 'BBBBB',
			year: 2012,
		});

		const res = await request(app)
			.get('/vehicle/my')
			.set('Authorization', `Bearer ${user1.generateToken()}`);

		const resBody: VehicleAttributesOptional[] = res.body.sort(
			(a: VehicleAttributesOptional, b: VehicleAttributesOptional) => {
				if (a.year > b.year) return 1;
				if (a.year < b.year) return -1;
				return 0;
			}
		);

		expect(res.statusCode).toEqual(200);

		// Vehicle1
		expect(uuidValidate(resBody[0].id as string)).toBeTruthy();
		expect(uuidValidate(resBody[0].userId as string)).toBeTruthy();
		expect(resBody[0].name).toBe(vehicle1.name);
		expect(resBody[0].description).toBe(vehicle1.description);
		expect(resBody[0].brand).toBe(vehicle1.brand);
		expect(resBody[0].color).toBe(vehicle1.color);
		expect(resBody[0].year).toBe(vehicle1.year);
		expect(resBody[0].board).toBe(vehicle1.board);
		expect(resBody[0].price).toBe(vehicle1.price);
		expect(isDateValid(new Date(resBody[0].createdAt as Date))).toBeTruthy();
		expect(isDateValid(new Date(resBody[0].updatedAt))).toBeTruthy();

		// Vehicle2
		expect(uuidValidate(resBody[1].id as string)).toBeTruthy();
		expect(uuidValidate(resBody[1].userId as string)).toBeTruthy();
		expect(resBody[1].name).toBe(vehicle2.name);
		expect(resBody[1].description).toBe(vehicle2.description);
		expect(resBody[1].brand).toBe(vehicle2.brand);
		expect(resBody[1].color).toBe(vehicle2.color);
		expect(resBody[1].year).toBe(vehicle2.year);
		expect(resBody[1].board).toBe(vehicle2.board);
		expect(resBody[1].price).toBe(vehicle2.price);
		expect(isDateValid(new Date(resBody[1].createdAt as Date))).toBeTruthy();
		expect(isDateValid(new Date(resBody[1].updatedAt))).toBeTruthy();

		await deleteVehicle(vehicle1.id);
		await deleteVehicle(vehicle2.id);
		await deleteVehicle(vehicle3.id);
		await deleteUser(user1.id);
		await deleteUser(user2.id);
	});
});
