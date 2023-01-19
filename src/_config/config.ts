import Joi from 'joi';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({
  path: `.env.${process.env.NODE_ENV || 'development'}.${process.env.HOST || 'local'}`,
});

const envSchema = Joi.object()
  .keys({
    HOST: Joi.string().valid('local', 'dev', 'stg', 'prod').required().default('local'),
    NODE_ENV: Joi.string().valid('production', 'development', 'staging').required(),
    PORT: Joi.number().default(3000),

    DB_PROVIDER: Joi.string().default('mongodb'),
    DB_HOST: Joi.string().default('localhost').description('Mongo DB host'),
    DB_PORT: Joi.number().default(27017).description('Mongo DB port'),
    DB_NAME: Joi.string().default('cybersweep-backend').description('Mongo DB name'),
    DB_UN: Joi.string().description('Mongo DB access username'),
    DB_PW: Joi.string().description('Mongo DB access password'),

    SALT: Joi.string().default('').description('salt for hashing'),

    CORS_ORG: Joi.array().items(Joi.string().default('*')).description('CORS origin array list'),
    CORS_ISCRED: Joi.boolean().default(true).description('controls if CORS requires credentials'),

    ROUTES_VER: Joi.string().default('v1').description('Express routes version'),

    LOG_DIR: Joi.string().default('../../logs').description('log folder location'),

    CDK_DEFAULT_REGION: Joi.string().default('us-east-1').description('AWS Account Region'),
    CDK_DEFAULT_ACCOUNT: Joi.string().default('default').description('AWS Account Profile'),
  })
  .unknown();

const { value: envVars, error } = envSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  // no loggger since logger needs config to be initialized
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  control: {
    routesVer: envVars.ROUTES_VER,
  },
  cors: {
    credentials: envVars.CORS_ISCRED,
    origin: envVars.CORS_ORG,
  },
  env: envVars.NODE_ENV,
  db: {
    provider: envVars.DB_PROVIDER,
    host: envVars.DB_HOST,
    name: envVars.DB_NAME,
    port: envVars.DB_PORT,
    pw: envVars.DB_PW,
    un: envVars.DB_UN,
  },
  port: envVars.PORT,
  security: {
    salt: envVars.SALT,
  },
  log: {
    dir: envVars.LOG_DIR,
  },
  cdk: {
    region: envVars.CDK_DEFAULT_REGION,
    account: envVars.CDK_DEFAULT_ACCOUNT,
  },
};

export const { cdk, control, cors, db, env, log, port, security } = config;
