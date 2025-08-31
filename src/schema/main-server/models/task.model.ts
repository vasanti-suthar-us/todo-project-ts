import Sequelize, { CreationOptional, Model } from 'sequelize';
import db from '../../../sequelize-client';

export interface TaskModelAttributes {
  id?: string;
  title: string;
  description: string;
  dueDate: Date;
  createdBy: string;
  isCompleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export default class Task extends Model<TaskModelAttributes> {
  declare id?: CreationOptional<string>;
  declare title: string;
  declare description: string;
  declare dueDate: Date;
  declare createdBy: string;
  declare isCompleted?: boolean;
  declare createdAt?: CreationOptional<Date>;
  declare updatedAt?: CreationOptional<Date>;
  declare deletedAt?: CreationOptional<Date | null>;

  static associate: (models: typeof db) => void;
}

export const task = (
  sequelize: Sequelize.Sequelize,
  DataTypes: typeof Sequelize.DataTypes
) => {
  Task.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    {
      sequelize,
      underscored: true,
      timestamps: true,
      paranoid: true,
      modelName: 'Task',
      tableName: 'tasks',
      indexes: [
        { fields: ['created_by'] },
        { fields: ['due_date'] },
      ],
    }
  );

  Task.associate = models => {
    Task.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  };

  return Task;
};
