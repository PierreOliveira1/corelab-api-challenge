import { DataTypes, Model, Optional } from 'sequelize';
import database from '../../database';

export type FavoriteAttributes = {
	id: string;
	userId: string;
	vehicleId: string;
	createdAt: Date;
	updatedAt: Date;
};

export interface FavoriteOptional
	extends Optional<FavoriteAttributes, 'id' | 'createdAt'> {}

interface FavoriteModel
	extends Model<FavoriteAttributes, FavoriteOptional>,
		FavoriteAttributes {}

const Favorite = database.define<FavoriteModel>(
	'favorite',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		vehicleId: {
			type: DataTypes.UUID,
			allowNull: false,
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

export default Favorite;
