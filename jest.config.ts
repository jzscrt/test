import tsconfig from './tsconfig.json';
import { Config } from '@jest/types';
import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';

dotenvConfig({
  path: join(__dirname, `../../.env.${process.env.NODE_ENV || 'development'}.${process.env.HOST || 'local'}`),
});

const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);
const config: Config.InitialOptions = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper,
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
};

export default config;
