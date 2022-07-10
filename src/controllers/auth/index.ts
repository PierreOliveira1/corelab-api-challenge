import { Request, Response, Router } from 'express';
import User, { UserOptional } from '../../models/User';

const Auth = Router();

Auth.post('/signup', async (req: Request, res: Response) => {
	const { email }: UserOptional = req.body;

	try {
		if (await User.findOne({ where: { email } }))
			return res
				.status(400)
				.send({ error: true, message: 'This user already exists' });

		const user = await User.create({
			...req.body,
			updatedAt: new Date(),
		});

		return res.status(201).send({
			token: user.generateToken(),
			user: {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
		});
	} catch (err) {
		return res
			.status(400)
			.send({ error: true, message: 'Error creating a new user' });
	}
});

Auth.post('/signin', async (req: Request, res: Response) => {
	const { email, password }: UserOptional = req.body;
	try {
		const user = await User.findOne({ where: { email } });

		if (!user)
			return res
				.status(404)
				.send({ error: true, message: 'This user does not exist' });

		if (!user.comparePassword(password))
			return res.status(401).send({ error: true, message: 'Password invalid' });

		return res.status(200).send({
			token: user.generateToken(),
			user: {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
		});
	} catch (err) {
		return res
			.status(400)
			.send({ error: true, message: 'Error searching for user' });
	}
});

export default Auth;
