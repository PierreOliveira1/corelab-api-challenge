import Favorite from '../../../../src/models/Favorite';
import User from '../../../../src/models/User';
import Vehicle from '../../../../src/models/Vehicle';
import uuidValidate from '../../../utils/uuidValidate';

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
		});

		expect(uuidValidate(favorite.id)).toBeTruthy();
		expect(uuidValidate(favorite.userId)).toBeTruthy();
		expect(uuidValidate(favorite.vehicleId)).toBeTruthy();
		expect(favorite.userId).toBe(user.id);
		expect(favorite.vehicleId).toBe(vehicle.id);
	});
});
