import Vehicle, {
	VehicleAttributesOptional,
} from '../../../../src/models/Vehicle';
import uuidValidate from '../../../utils/uuidValidate';
import deleteVehicle from '../../../utils/deleteVehicle';
import isDateValid from '../../../utils/isDateValid';

describe('Vehicle Model', () => {
	it('should create new vehicle', async () => {
		const vehicle: VehicleAttributesOptional = {
			name: 'Uno',
			brand: 'Fiat',
			color: 'Verde',
			year: 2010,
			board: 'ABC1525',
		};

		const newVehicle = await Vehicle.create(vehicle);

		expect(uuidValidate(newVehicle.id)).toBeTruthy();
		expect(newVehicle.name).toBe(vehicle.name);
		expect(newVehicle.brand).toBe(vehicle.brand);
		expect(newVehicle.color).toBe(vehicle.color);
		expect(newVehicle.year).toBe(vehicle.year);
		expect(newVehicle.board).toBe(vehicle.board);
		expect(isDateValid(newVehicle.createdAt)).toBeTruthy();
		expect(isDateValid(newVehicle.updatedAt)).toBeTruthy();

		await deleteVehicle(newVehicle.id);
	});
});
