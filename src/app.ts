import cors from 'cors';
import db from '@databases';
import express from 'express';
import helmet from 'helmet';
import passport from 'passport';
import { connect, set } from 'mongoose';
import { control, db as dbConfig, env, port } from '@config/config';
import { errorConverter, errorHandler } from '@middlewares/error.middleware';
import { join } from 'path';
import { jwtStrategy } from '@config/passport';
import { logger } from '@utils/logger.util';
import { Route } from '@interfaces/routes.interface';

console.log('123');
console.log(process.env);
console.log(typeof process.env);

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
    this.initializeErrorHandling();
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
    console.log(dbConnection);
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
    passport.use('jwt', jwtStrategy);
    this.app.use(passport.initialize());
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach(route => {
      this.app.use(`/${control.routesVer}`, route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorConverter);
    this.app.use(errorHandler);
  }
}

export default App;
