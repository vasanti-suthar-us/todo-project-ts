import * as http from 'http';
import express from 'express';
import config from './config/config';
import sequelizeClient from './sequelize-client';
import routes from './rest';

import { startReminderJob } from "./scheduler";

const app: express.Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  `/${config.API_PREFIX_ROUTE}/api`,
  routes,
);

const initServer = async () => {
  try {
    const httpServer: http.Server = http.createServer(app);
    await sequelizeClient.sequelize.sync();
    startReminderJob();

    httpServer.listen(config.PORT, () => {
      console.log(
        `Server ready at http://localhost:${config.PORT}/${config.API_PREFIX_ROUTE}`
      );
    });
    return true;
  } catch (error) {
    console.log(`Error while initialization of server ${error}`);
    return error;
  }
};

initServer();

export default app;
