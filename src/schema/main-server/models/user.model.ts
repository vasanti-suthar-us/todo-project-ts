/* eslint-disable max-lines */
import Sequelize, { CreationOptional, Model } from 'sequelize';

import db from '../../../sequelize-client';
import { generatePassword } from '../../../utils/auth/password-generation';

export default class User extends Model {
  declare id: CreationOptional<string>;
  declare name: string | null;
  declare email: string | null;
  declare password: string | null;
  declare createdAt?: CreationOptional<Date>;
  declare updatedAt?: CreationOptional<Date>;
  declare deletedAt?: CreationOptional<Date>;

  static associate: (models: typeof db) => void;
}

export const user = (
  sequelize: Sequelize.Sequelize,
  DataTypes: typeof Sequelize.DataTypes
) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
        set(value: string) {
          this.setDataValue('email', value?.trim().toLowerCase());
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
        set(value: string) {
          const encryptedPassword = generatePassword(value);
          this.setDataValue('password', encryptedPassword);
        },
      },
    },
    {
      sequelize,
      underscored: true,
      timestamps: true,
      paranoid: true,
      modelName: 'User',
      tableName: 'users',
      indexes: [
        { fields: ['email'] },
        { fields: ['password'] },
      ],
    }
  );

  User.associate = models => {
    User.hasMany(models.Task, { foreignKey: 'createdBy', as: 'tasks' });
    User.hasMany(models.AccessToken, { foreignKey: 'userId', as: 'accessTokens' });
    User.hasMany(models.TaskReminder, { foreignKey: 'userId', as: 'taskReminders' });
  };

  return User;
};
