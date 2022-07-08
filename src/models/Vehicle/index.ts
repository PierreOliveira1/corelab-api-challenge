import { DataTypes, Model, Optional } from 'sequelize';
import database from '../../database';

export type VehicleAttributes = {
	id: string;
	name: string;
	brand: string;
	color: string;
	year: number;
	board: string;
	createdAt: Date;
	updatedAt: Date;
};

export interface VehicleAttributesOptional
	extends Optional<VehicleAttributes, 'id' | 'createdAt'> {}

interface VehicleModel
	extends Model<VehicleAttributes, VehicleAttributesOptional>,
		VehicleAttributes {}

const Vehicle = database.define<VehicleModel>(
	'vehicle',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		brand: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		color: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		year: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		board: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			set(value: string) {
				this.setDataValue('board', value.toUpperCase());
			},
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: new Date(),
			allowNull: true,
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

export default Vehicle;
