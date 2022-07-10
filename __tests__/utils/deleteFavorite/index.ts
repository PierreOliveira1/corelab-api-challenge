import Favorite from '../../../src/models/Favorite';

async function deleteFavorite(id: string) {
	try {
		const favorite = await Favorite.findOne({ where: { id } });
		await favorite?.destroy();
	} catch (err) {
		console.log(err);
	}
}

export default deleteFavorite;
