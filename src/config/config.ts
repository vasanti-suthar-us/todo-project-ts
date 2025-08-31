import * as dotenv from 'dotenv';
dotenv.config();

export default {
  ENV: process.env.NODE_ENV as string,
  HOST: process.env.HOST as string,
  PORT: Number(process.env.PORT) as unknown as number,
  LOG_LEVEL: process.env.LOG_LEVEL || ('info' as string),
  API_PREFIX_ROUTE: process.env.API_PREFIX_ROUTE || ('api' as string),
  ENCRYPTION: {
    IV: process.env.ENCRYPTION_IV as string,
    SECRET: process.env.ENCRYPTION_SECRET as string,
    PASSWORD_SALT: process.env.ENCRYPTION_PASSWORD_SALT as string,
    PASSWORD_ITERATIONS: Number(process.env.ENCRYPTION_PASSWORD_ITERATIONS) || 1000,
  },
  JWT: {
    SECRET: process.env.JWT_SECRET as string,
    LIFE_TIME: process.env.JWT_LIFE_TIME || ('7d' as string),
    RESET_TOKEN_LIFE_TIME: Number(process.env.JWT_RESET_TOKEN_LIFE_TIME) || (1 as number),
    VERIFICATION_TOKEN_LIFE_TIME: process.env.JWT_VERIFICATION_TOKEN_LIFE_TIME || ('1d' as string),
  },
  EMAIL_PROVIDER: {
    USER: process.env.EMAIL_USER,
    PASSWORD: process.env.EMAIL_PASSWORD,
  },
  DAILY_TASK_REMINDER_CRON_EXPRESSION: process.env.DAILY_TASK_REMINDER_CRON_EXPRESSION,
};
