import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import database from '../../database';
import Envs from '../../config/env';

const { JWT_SECRET } = Envs;

export type UserAttributes = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
};

type UserFunctions = {
	comparePassword: (password: string) => boolean;
	generateToken: () => string;
};

export interface UserOptional
	extends Optional<UserAttributes, 'id' | 'createdAt'> {}

interface UserModel
	extends Model<UserAttributes, UserOptional>,
		UserAttributes,
		UserFunctions {}

const User = database.define<UserModel>(
	'user',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: false,
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			set(value: string) {
				this.setDataValue('email', value.toLowerCase());
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			set(value: string) {
				const hash = bcrypt.hashSync(value, 10);
				this.setDataValue('password', hash);
			},
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: new Date(),
			allowNull: false,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		freezeTableName: true,
	}
);

User.prototype.comparePassword = function comparePassword(password: string) {
	return bcrypt.compareSync(password, this.password);
};

User.prototype.generateToken = function generateToken() {
	const token = jwt.sign({ id: this.id, email: this.email }, JWT_SECRET, {
		expiresIn: '24h',
	});

	return token;
};

export default User;
