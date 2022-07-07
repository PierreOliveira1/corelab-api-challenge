import Vehicle from '../../../src/models/Vehicle';

async function deleteVehicle(id: string) {
	try {
		const vehicle = await Vehicle.findOne({ where: { id } });
		await vehicle?.destroy();
	} catch (err) {
		console.log(err);
	}
}

export default deleteVehicle;
