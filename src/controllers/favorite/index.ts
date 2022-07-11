import { Router, Request, Response } from 'express';
import checkToken from '../../middlewares/checkToken';
import Favorite, { FavoriteAttributes } from '../../models/Favorite';

const FavoriteRouter = Router();

FavoriteRouter.post('/add', checkToken, async (req: Request, res: Response) => {
	const { vehicleId }: FavoriteAttributes = req.body;
	try {
		if (await Favorite.findOne({ where: { userId: res.locals.id, vehicleId } }))
			return res
				.status(400)
				.send({ error: true, message: 'This vehicle is already in favorites' });

		const favorite = await Favorite.create({
			userId: res.locals.id,
			vehicleId,
			updatedAt: new Date(),
		});

		return res.status(201).send(favorite);
	} catch (err) {
		console.log(err);
		return res
			.status(400)
			.send({ error: true, message: 'Error adding to favorites' });
	}
});

FavoriteRouter.delete(
	'/delete/:id',
	checkToken,
	async (req: Request, res: Response) => {
		try {
			const favorite = await Favorite.findOne({ where: { id: req.params.id } });
			await favorite?.destroy();

			return res.status(200).send({ deleted: true });
		} catch (err) {
			return res
				.status(400)
				.send({ error: true, message: 'Error deleting favorite' });
		}
	}
);

export default FavoriteRouter;
