import config from '../../config/config';
import winston, { transports } from 'winston'

const defaultLoggerConfig = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console(),
  ],
});

const loggerObj = winston.createLogger(defaultLoggerConfig);

