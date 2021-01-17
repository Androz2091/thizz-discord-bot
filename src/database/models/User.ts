import { Snowflake } from 'discord.js';
import { Model, DataTypes } from 'sequelize';
import { database } from '../';
import { Food } from '../../types/food';

export class User extends Model {
  public id!: number;
  public job!: string|null;
  public money!: number;
  public health!: number;
  public hunger!: number;
  public foods!: Food[];
  public lastApplyAt!: string;
  public lastWorkAt!: string;
  public workTimes!: number;
  public workLevel!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
User.init(
    {
        id: {
            type: new DataTypes.CHAR(32),
            primaryKey: true,
            allowNull: false
        },
        job: {
            type: new DataTypes.STRING(32),
            allowNull: true
        },
        money: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        health: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100
        },
        hunger: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100
        },
        foods: {
            type: new DataTypes.ARRAY(DataTypes.JSON),
            allowNull: false,
            defaultValue: []
        },
        lastApplyAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: 0
        },
        lastWorkAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: 0
        },
        workTimes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        workLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        tableName: 'users',
        sequelize: database
    }
);

if (process.env.ENVIRONMENT === 'development') {
    User.sync({ force: true }).then(() => console.log('User table created'));
}

export const getUser = (userID: Snowflake): Promise<User> => {
    return new Promise((resolve) => {
        User.findOrCreate({
            where: {
                id: userID
            }
        }).then((res) => {
            resolve(res[0]);
        });
    });
};

export const updateUser = (userID: Snowflake, newData: Partial<User>): Promise<void> => {
    return new Promise((resolve) => {
        User.update(newData, {
            where: {
                id: userID
            }
        }).then(() => {
            resolve();
        });
    });
};
