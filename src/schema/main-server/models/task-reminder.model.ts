import Sequelize, { CreationOptional, Model } from 'sequelize';
import db from '../../../sequelize-client';

export interface TaskReminderModelAttributes {
  id?: string;
  taskId: string;
  userId: string;
  reminderTime: Date;
  sentOn: Date | null;
  errorLog: object | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export default class TaskReminder extends Model<TaskReminderModelAttributes> {
  declare id?: CreationOptional<string>;
  declare taskId: string;
  declare userId: string;
  declare reminderTime: Date;
  declare sentOn: CreationOptional<Date | null>;
  declare errorLog: CreationOptional<object | null>;
  declare createdAt?: CreationOptional<Date>;
  declare updatedAt?: CreationOptional<Date>;
  declare deletedAt?: CreationOptional<Date | null>;

  static associate: (models: typeof db) => void;
}

export const taskReminder = (
  sequelize: Sequelize.Sequelize,
  DataTypes: typeof Sequelize.DataTypes
) => {
  TaskReminder.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      taskId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'tasks',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      reminderTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      sentOn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      errorLog: {
        type: DataTypes.JSONB,
        allowNull: true,
      }
    },
    {
      sequelize,
      underscored: true,
      timestamps: true,
      paranoid: true,
      modelName: 'TaskReminder',
      tableName: 'task_reminders',
      indexes: [
        { fields: ['task_id'] },
        { fields: ['user_id'] },
        { fields: ['reminder_time'] },
      ],
    }
  );

  TaskReminder.associate = models => {
    TaskReminder.belongsTo(models.Task, { foreignKey: 'taskId', as: 'task' });
    TaskReminder.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return TaskReminder;
};
