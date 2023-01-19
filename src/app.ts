import cors from 'cors';
import db from '@databases';
import express from 'express';
import helmet from 'helmet';
import { connect, set } from 'mongoose';
import { control, db as dbConfig, env, port } from '@config/config';
import { join } from 'path';
import { logger } from '@utils/logger.util';
import { Route } from '@interfaces/routes.interface';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor(routes: Route[]) {
    this.app = express();
    this.port = port;
    this.env = env;

    this.initializeMiddlewares();
    this.connectToDatabase();
    this.initializeRoutes(routes);
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`===================================`);
      logger.info(`ENV: ${this.env}`);
      logger.info(`CS Backend listening to port: ${this.port}`);
      logger.info(`===================================`);
    });
  }

  private connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true);
    }
    const dbConnection = db[dbConfig.provider];
    connect(dbConnection.url, err => {
      if (err) {
        logger.error('Error connecting to DB!');
        logger.error('Error:', err);
      } else {
        logger.info('Connected to DB!');
      }
    });
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.static(join(__dirname, '../public')));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach(route => {
      this.app.use(`/${control.routesVer}`, route.router);
    });
  }
}

export default App;
