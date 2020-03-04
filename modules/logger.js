
const winston = require('winston');

const LOGLEVEL = (process.env.LOGLEVEL || 'debug').toLowerCase();
const logTransports = [
  new (winston.transports.Console)({
    timestamp: () => new Date().toISOString(),
    formatter: options => (
      `${options.timestamp()}  ${options.level.toUpperCase()}: ${options.message ? options.message : ''} ${(options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : '')}` // eslint-disable-line
    ),
  }),
];
exports.logger = winston.createLogger({
  transports: logTransports,
  level: LOGLEVEL,
});

const dbLogTransports = [
  new winston.transports.File({ filename: '../logs/error.log', level: 'error' }),
  new winston.transports.File({ filename: '../logs/db.log' })
];
exports.dbLogger = winston.createLogger({
  transports: dbLogTransports,
  level: 'info',
  format: winston.format.json(),
});
