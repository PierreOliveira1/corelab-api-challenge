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

		res.status(200).send(vehicle);
	} catch (err) {
		res.status(400).send({ error: true, message: 'Error adding vehicle' });
	}
});

export default VehicleRouter;
