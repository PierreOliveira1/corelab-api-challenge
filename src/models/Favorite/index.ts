import { DataTypes, Model, Optional } from 'sequelize';
import database from '../../database';

type FavoriteAttributes = {
	id: string;
	userId: string;
	vehicleId: string;
};

interface FavoriteOptional extends Optional<FavoriteAttributes, 'id'> {}

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
	},
	{
		freezeTableName: true,
	}
);

export default Favorite;
