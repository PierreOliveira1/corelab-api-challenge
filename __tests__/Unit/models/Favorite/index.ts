import Favorite from '../../../../src/models/Favorite';
import User from '../../../../src/models/User';
import Vehicle from '../../../../src/models/Vehicle';
import uuidValidate from '../../../utils/uuidValidate';
import deleteUser from '../../../utils/deleteUser';
import deleteVehicle from '../../../utils/deleteVehicle';
import deleteFavorite from '../../../utils/deleteFavorite';
import isDateValid from '../../../utils/isDateValid';

describe('Model favorite', () => {
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

		const favorite = await Favorite.create({
			userId: user.id,
			vehicleId: vehicle.id,
			updatedAt: new Date(),
		});

		expect(uuidValidate(favorite.id)).toBeTruthy();
		expect(uuidValidate(favorite.userId)).toBeTruthy();
		expect(uuidValidate(favorite.vehicleId)).toBeTruthy();
		expect(favorite.userId).toBe(user.id);
		expect(favorite.vehicleId).toBe(vehicle.id);
		expect(isDateValid(favorite.createdAt)).toBeTruthy();
		expect(isDateValid(favorite.updatedAt)).toBeTruthy();

		await deleteUser(user.id);
		await deleteVehicle(vehicle.id);
		await deleteFavorite(favorite.id);
	});
});
