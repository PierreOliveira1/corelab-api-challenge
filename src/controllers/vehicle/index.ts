import { Request, Response, Router } from 'express';
import Vehicle, { VehicleAttributesOptional } from '../../models/Vehicle';

const VehicleRouter = Router();

VehicleRouter.post('/add', async (req: Request, res: Response) => {
	const { name, brand, color, year, board }: VehicleAttributesOptional =
		req.body;

	try {
		if (await Vehicle.findOne({ where: { board } })) {
			return res
				.status(400)
				.send({ error: true, message: 'This board already exists' });
		}

		const vehicle = await Vehicle.create({
			name,
			brand,
			color,
			year,
			board,
			updatedAt: new Date(),
		});

		res.status(201).send(vehicle);
	} catch (err) {
		res.status(400).send({ error: true, message: 'Error adding vehicle' });
	}
});

VehicleRouter.get('/all', async (req: Request, res: Response) => {
	try {
		const allVehicles = await Vehicle.findAll();
		res.status(200).send(allVehicles);
	} catch (err) {
		res
			.status(400)
			.send({ error: true, message: 'Error when searching all vehicles' });
	}
});

VehicleRouter.put('/update/:id', async (req: Request, res: Response) => {
	const data: VehicleAttributesOptional = req.body;
	try {
		data.id = undefined;
		data.createdAt = undefined;
		data.updatedAt = new Date();

		const [updated] = await Vehicle.update(data, {
			where: { id: req.params.id },
		});

		res.status(200).send({ updated: updated !== 0 });
	} catch (err) {
		res.status(400).send({ error: true, message: 'Error updating vehicle' });
	}
});

VehicleRouter.delete('/delete/:id', async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const vehicle = await Vehicle.findOne({ where: { id } });
		await vehicle?.destroy();
		res.status(200).send({ deleted: true });
	} catch (err) {
		res
			.status(400)
			.send({ error: true, message: 'Error when deleting vehicle' });
	}
});

export default VehicleRouter;
