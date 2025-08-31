import Sequelize, { CreationOptional, Model } from 'sequelize';
import db from '../../../sequelize-client';
import encryption from '../../../utils/auth/encryption';

export interface AccessTokenModelAttributes {
  id?: string;
  userId: string;
  token: string;
  expiredAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export default class AccessToken extends Model<AccessTokenModelAttributes> {
  declare id?: CreationOptional<string>;
  declare userId: string;
  declare token: string;
  declare expiredAt: Date;
  declare createdAt?: CreationOptional<Date>;
  declare updatedAt?: CreationOptional<Date>;
  declare deletedAt?: CreationOptional<Date | null>;

  static associate: (models: typeof db) => void;
}

export const accessToken = (
  sequelize: Sequelize.Sequelize,
  DataTypes: typeof Sequelize.DataTypes
) => {
  AccessToken.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
        get(): string | undefined {
          const rawValue = this.getDataValue('token');
          if (rawValue) {
            const decryptedToken = encryption.decryptWithAES(rawValue);
            return decryptedToken;
          }
        },
        set(value: string) {
          if (value) {
            const encryptedToken = encryption.encryptWithAES(value);
            this.setDataValue('token', encryptedToken);
          }
        },
      },
      expiredAt: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    },
    {
      sequelize,
      underscored: true,
      timestamps: true,
      paranoid: true,
      modelName: 'AccessToken',
      tableName: 'access_tokens',
      indexes: [
        { fields: ['user_id'] },
      ],
    }
  );

  AccessToken.associate = models => {
    AccessToken.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return AccessToken;
};
