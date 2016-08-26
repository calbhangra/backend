import Sequelize from 'sequelize';
import {postgres} from '../lib/db';

export default postgres.define('Gig', {
  date: {
    type: Sequelize.DATE,
    validate: {
      isDate: true,
    }
  },
  accepted: {
    type: Sequelize.BOOLEAN,
    validate: {
      isBoolean: true,
    },
  },
  compensation: {
    type: Sequelize.DOUBLE,
    validate: {
      isNumeric: true,
    },
  },
  contactEmail: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  dancersRequested: {
    type: Sequelize.INTEGER,
    validate: {
      isInt: true,
    },
  },
});
