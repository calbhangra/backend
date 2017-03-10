import config from '../config';
import Sequelize from 'sequelize';

export default new Sequelize(
  config.get('database.database'),
  config.get('database.username'),
  config.get('database.password'),
  {
    host: config.get('database.host'),
    port: config.get('database.port'),
    dialect: config.get('database.dialect'),
    query: {attributes: {exclude: ['password']}},
  }
);
