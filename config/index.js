import path from 'path';
import convict from 'convict';

const config = convict({
  env: {
    doc: 'application environment',
    format: ['production', 'development'],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'the port the server should listen on',
    format: 'port',
    default: 0,
    env: 'PORT',
  },
  database: {
    host: {
      doc: 'URL pointing to the database server',
      format: 'url',
      default: null,
      env: 'DB_HOST',
    },
    port: {
      doc: 'port for the database server',
      format: 'port',
      default: null,
      env: 'DB_PORT',
    },
    username: {
      doc: 'username to use for connecting to database server',
      format: String,
      default: null,
      env: 'DB_USERNAME',
    },
    password: {
      doc: 'password to use for connecting to database server',
      format: String,
      default: null,
      env: 'DB_PASSWORD',
    },
    database: {
      doc: 'name of the database to use on the database server',
      format: String,
      default: null,
      env: 'DB_DATABASE',
    },
    dialect: {
      doc: 'dialect of the database server',
      format: String,
      default: null,
      env: 'DB_DIALECT',
    },
  },
  jwt: {
    algorithm: {
      doc: 'the algorithm to use for generating JWT signatures',
      format: [
        'HS256', 'HS384', 'HS512',
        'RS256', 'RS384', 'RS512',
        'ES256', 'ES384', 'ES512',
      ],
      default: null,
      env: 'JWT_ALGO',
    },
    secret: {
      doc: 'base64 encoded string to use for signing JWTs',
      format: String,
      default: null,
      env: 'JWT_SECRET',
    },
  },
});

const environmentConfig = path.join(__dirname, config.get('env')) + '.json';

config.loadFile(environmentConfig);

config.validate({strict: true});

export default config;
