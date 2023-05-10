import winstonDaily from 'winston-daily-rotate-file';
import { createLogger, format, transports } from 'winston';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { log } from '@config/config';

/**
 * Create a directory for the logs if it doesn't already exist
 * @constant {string} logDir - the path to the logs directory
 */
const logDir: string = join(__dirname, log.dir);
if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

/**
 * Define log format
 * @constant {Object} logFormat - the format for the log messages
 */
const logFormat = format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

/**
 * Create a logger with specified format and transport options
 * @constant {Object} logger - the logger object
 */
const logger = createLogger({
  format: format.combine(
    format.label({
      label: '[LOGGER]',
    }),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    // debug log setting
    new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/debug', // log file /logs/debug/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      json: false,
      zippedArchive: true,
    }),
    // error log setting
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error', // log file /logs/error/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
});

/**
 * Add a transport for console logs
 */
logger.add(
  new transports.Console({
    format: format.combine(
      format.splat(),
      format.colorize({
        all: true,
      }),
    ),
  }),
);

/**
 * Export the logger for use in other parts of the application
 */
export { logger };
