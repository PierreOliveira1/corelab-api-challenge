import Vehicle, {
	VehicleAttributesOptional,
} from '../../../../src/models/Vehicle';
import User from '../../../../src/models/User';
import uuidValidate from '../../../utils/uuidValidate';
import deleteVehicle from '../../../utils/deleteVehicle';
import isDateValid from '../../../utils/isDateValid';
import deleteUser from '../../../utils/deleteUser';

describe('Vehicle Model', () => {
	it('should create new vehicle', async () => {
		const user = await User.create({
			firstName: 'Pierre',
			lastName: 'Oliveira',
			email: 'pierre@gmail.com',
			password: '123456789',
			updatedAt: new Date(),
		});
		const vehicle: VehicleAttributesOptional = {
			userId: user.id,
			name: 'Uno',
			description: 'Novo zero km',
			brand: 'Fiat',
			color: 'Verde',
			year: 2010,
			board: 'ABC1525',
			price: 5000.0,
			updatedAt: new Date(),
		};

		const newVehicle = await Vehicle.create(vehicle);

		expect(uuidValidate(newVehicle.id)).toBeTruthy();
		expect(newVehicle.name).toBe(vehicle.name);
		expect(newVehicle.description).toBe(vehicle.description);
		expect(newVehicle.brand).toBe(vehicle.brand);
		expect(newVehicle.color).toBe(vehicle.color);
		expect(newVehicle.year).toBe(vehicle.year);
		expect(newVehicle.board).toBe(vehicle.board);
		expect(newVehicle.price).toBe(vehicle.price);
		expect(isDateValid(newVehicle.createdAt)).toBeTruthy();
		expect(isDateValid(newVehicle.updatedAt)).toBeTruthy();

		await deleteVehicle(newVehicle.id);
		await deleteUser(user.id);
	});
});
