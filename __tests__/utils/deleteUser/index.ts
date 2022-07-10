import User from '../../../src/models/User';

async function deleteUser(id: string) {
	try {
		const user = await User.findOne({ where: { id } });
		await user?.destroy();
	} catch (err) {
		console.log(err);
	}
}

export default deleteUser;
