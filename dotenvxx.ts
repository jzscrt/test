import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';

dotenvConfig({
  path: join(__dirname, `../../.env.${process.env.NODE_ENV || 'development'}.${process.env.HOST || 'local'}`),
});
