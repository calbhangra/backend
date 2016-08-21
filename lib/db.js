'use strict';

import config from 'config';
import Sequelize from 'sequelize';

var postgresConfig = config.get('postgres');

var postgres = new Sequelize(
  postgresConfig.database,
  postgresConfig.username,
  postgresConfig.password,
  {
    dialect: postgresConfig.dialect,
    query: {attributes: {exclude: ['password']}},
  }
);

export {postgres};
