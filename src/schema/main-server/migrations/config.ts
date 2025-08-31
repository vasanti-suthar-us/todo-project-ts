import * as dotenv from 'dotenv';
import { Dialect } from 'sequelize';

import CONFIG from '../../config/config';

dotenv.config();

const env: string = CONFIG.DATABASE.ENV || 'development' as string;
const username: string = CONFIG.DATABASE.USERNAME as string;
const password: string = CONFIG.DATABASE.PASSWORD as string;
const database: string = CONFIG.DATABASE.DATABASE as string;
const host: string = CONFIG.DATABASE.HOST as string;
const port: number = Number(CONFIG.DATABASE.PORT) as number;
const dialect: Dialect = 'postgres' as Dialect;

const config = {
  dialect,
  username,
  password,
  database,
  host,
  port,
  logging: false,
  pool: {
    max: 50,
    min: 0,
    acquire: 1200000,
    idle: 1000000,
  },
  migrationStorageTableName: '_migrations',
};

const dbConfigs = {
  [env]: config,
};

export = dbConfigs
