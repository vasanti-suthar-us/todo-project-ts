import { DataTypes, Op, Sequelize } from 'sequelize';

import appConfig from './config/config';
import CONFIG from './schema/main-server/migrations/config';

import { user } from './schema/main-server/models/user.model';
import { task } from './schema/main-server/models/task.model';
import { taskReminder } from './schema/main-server/models/task-reminder.model';
import { accessToken } from './schema/main-server/models/access-token.model';

const NODE_ENV = appConfig.ENV;
const env = NODE_ENV || 'development';

const dbConfig = CONFIG[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const db = {
  sequelize,
  Op,
  User: user(sequelize, DataTypes),
  Task: task(sequelize, DataTypes),
  TaskReminder: taskReminder(sequelize, DataTypes),
  AccessToken: accessToken(sequelize, DataTypes),
  models: sequelize.models,
};

type Model = (typeof db)[keyof typeof db];
type ModelWithAssociate = Model & { associate?: (models: typeof db) => void };

Object.values(db).forEach((model: ModelWithAssociate) => {
  if (model.associate) {
    model.associate(db);
  }
});

export default db;
