import request from 'supertest';
import app from '../../../../src/app';
import User from '../../../../src/models/User';
import Vehicle from '../../../../src/models/Vehicle';
import Favorite, { FavoriteAttributes } from '../../../../src/models/Favorite';
import uuidValidate from '../../../utils/uuidValidate';
import deleteUser from '../../../utils/deleteUser';
import deleteVehicle from '../../../utils/deleteVehicle';
import deleteFavorite from '../../../utils/deleteFavorite';
import isDateValid from '../../../utils/isDateValid';

describe('Route favorite', () => {
	it('should add vehicle in favorite', async () => {
		const user = await User.create({
			firstName: 'Pierre',
			lastName: 'Oliveira',
			email: 'pierre@gmail.com',
			password: '123456789',
			updatedAt: new Date(),
		});
		const vehicle = await Vehicle.create({
			userId: user.id,
			name: 'Uno',
			description: 'Novo zero km',
			brand: 'Fiat',
			color: 'Verde',
			year: 2010,
			board: 'ABC1525',
			price: 5000.0,
			updatedAt: new Date(),
		});

		const res = await request(app)
			.post('/favorite/add')
			.set('Authorization', `Bearer ${user.generateToken()}`)
			.send({ vehicleId: vehicle.id });

		const { id, userId, vehicleId, createdAt, updatedAt }: FavoriteAttributes =
			res.body;

		expect(res.statusCode).toEqual(201);
		expect(uuidValidate(id)).toBeTruthy();
		expect(uuidValidate(userId)).toBeTruthy();
		expect(uuidValidate(vehicleId)).toBeTruthy();
		expect(userId).toBe(user.id);
		expect(vehicleId).toBe(vehicle.id);
		expect(isDateValid(new Date(createdAt))).toBeTruthy();
		expect(isDateValid(new Date(updatedAt))).toBeTruthy();

		await deleteUser(user.id);
		await deleteVehicle(vehicle.id);
		await deleteFavorite(id);
	});

	it('should error this vehicle is already in favorites', async () => {
		const user = await User.create({
			firstName: 'Pierre',
			lastName: 'Oliveira',
			email: 'pierre@gmail.com',
			password: '123456789',
			updatedAt: new Date(),
		});
		const vehicle = await Vehicle.create({
			userId: user.id,
			name: 'Uno',
			description: 'Novo zero km',
			brand: 'Fiat',
			color: 'Verde',
			year: 2010,
			board: 'ABC1525',
			price: 5000.0,
			updatedAt: new Date(),
		});

		const favorite = await Favorite.create({
			userId: user.id,
			vehicleId: vehicle.id,
			updatedAt: new Date(),
		});

		const res = await request(app)
			.post('/favorite/add')
			.set('Authorization', `Bearer ${user.generateToken()}`)
			.send({ vehicleId: vehicle.id });

		interface ResBody {
			error: boolean;
			message: string;
		}

		const { error, message }: ResBody = res.body;

		expect(res.statusCode).toEqual(400);
		expect(error).toBeTruthy();
		expect(message).toBe('This vehicle is already in favorites');

		await deleteUser(user.id);
		await deleteVehicle(vehicle.id);
		await deleteFavorite(favorite.id);
	});

	it('should error deleting favorite', async () => {
		const user = await User.create({
			firstName: 'Pierre',
			lastName: 'Oliveira',
			email: 'pierre@gmail.com',
			password: '123456789',
			updatedAt: new Date(),
		});
		const vehicle = await Vehicle.create({
			userId: user.id,
			name: 'Uno',
			description: 'Novo zero km',
			brand: 'Fiat',
			color: 'Verde',
			year: 2010,
			board: 'ABC1525',
			price: 5000.0,
			updatedAt: new Date(),
		});

		const favorite = await Favorite.create({
			userId: user.id,
			vehicleId: vehicle.id,
			updatedAt: new Date(),
		});

		const res = await request(app)
			.delete(`/favorite/delete/${favorite.id}`)
			.set('Authorization', `Bearer ${user.generateToken()}`);

		interface ResBody {
			deleted: boolean;
		}

		const { deleted }: ResBody = res.body;

		expect(res.statusCode).toEqual(200);
		expect(deleted).toBeTruthy();

		await deleteUser(user.id);
		await deleteVehicle(vehicle.id);
	});
});
