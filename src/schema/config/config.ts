import * as dotenv from 'dotenv';
dotenv.config();

export default {
  DATABASE: {
    USERNAME: process.env.POSTGRES_USERNAME,
    HOST: process.env.POSTGRES_HOST,
    PASSWORD: process.env.POSTGRES_PASSWORD,
    DATABASE: process.env.POSTGRES_DATABASE,
    PORT: process.env.POSTGRES_PORT,
    ENV: process.env.NODE_ENV
  }
};

