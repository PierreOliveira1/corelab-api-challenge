import { Request, Response, Router } from 'express';
import User, { UserOptional } from '../../models/User';

const Auth = Router();

Auth.post('/signup', async (req: Request, res: Response) => {
	const { email }: UserOptional = req.body;

	try {
		if (await User.findOne({ where: { email } }))
			return res
				.status(200)
				.send({ error: true, message: 'This user already exists' });

		const user = await User.create({
			...req.body,
			updatedAt: new Date(),
		});

		return res.status(201).send({
			token: user.generateToken(),
			user,
		});
	} catch (err) {
		return res
			.status(400)
			.send({ error: true, message: 'Error creating a new user' });
	}
});

export default Auth;
