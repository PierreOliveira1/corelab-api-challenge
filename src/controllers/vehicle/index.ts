import { Request, Response, Router } from 'express';
import Vehicle, { VehicleAttributesOptional } from '../../models/Vehicle';
import checkToken from '../../middlewares/checkToken';
import Favorite from '../../models/Favorite';

const VehicleRouter = Router();

VehicleRouter.post('/add', checkToken, async (req: Request, res: Response) => {
	const {
		name,
		description,
		brand,
		color,
		price,
		year,
		board,
	}: VehicleAttributesOptional = req.body;

	try {
		if (await Vehicle.findOne({ where: { board } })) {
			return res
				.status(400)
				.send({ error: true, message: 'This board already exists' });
		}

		const vehicle = await Vehicle.create({
			userId: res.locals.id,
			name,
			description,
			brand,
			color,
			price,
			year,
			board,
			updatedAt: new Date(),
		});

		return res.status(201).send(vehicle);
	} catch (err) {
		return res
			.status(400)
			.send({ error: true, message: 'Error adding vehicle' });
	}
});

VehicleRouter.get('/all', checkToken, async (req: Request, res: Response) => {
	try {
		const allVehicles = await Vehicle.findAll();
		return res.status(200).send(allVehicles);
	} catch (err) {
		return res
			.status(400)
			.send({ error: true, message: 'Error when searching all vehicles' });
	}
});

VehicleRouter.get('/my', checkToken, async (req: Request, res: Response) => {
	try {
		const myVehicles = await Vehicle.findAll({
			where: { userId: res.locals.id },
		});

		return res.status(200).send(myVehicles);
	} catch (err) {
		return res
			.status(400)
			.send({ error: true, message: 'Error searching your vehicles' });
	}
});

VehicleRouter.put(
	'/update/:id',
	checkToken,
	async (req: Request, res: Response) => {
		const data: VehicleAttributesOptional = req.body;
		try {
			data.id = undefined;
			data.userId = undefined;
			data.createdAt = undefined;
			data.updatedAt = new Date();

			const [updated] = await Vehicle.update(data, {
				where: { id: req.params.id, userId: res.locals.id },
			});

			return res.status(200).send({ updated: updated !== 0 });
		} catch (err) {
			return res
				.status(400)
				.send({ error: true, message: 'Error updating vehicle' });
		}
	}
);

VehicleRouter.delete(
	'/delete/:id',
	checkToken,
	async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const vehicle = await Vehicle.findOne({
				where: { id, userId: res.locals.id },
			});

			await Favorite.destroy({ where: { vehicleId: id } });
			await vehicle?.destroy();

			return res.status(200).send({ deleted: true });
		} catch (err) {
			return res
				.status(400)
				.send({ error: true, message: 'Error when deleting vehicle' });
		}
	}
);

export default VehicleRouter;
