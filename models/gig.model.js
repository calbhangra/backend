import Sequelize from 'sequelize';

import database from '../lib/db';
import validations from './validations';

// TODO vardi, paagan, m/f, location, type, details
export default database.define('Gig', {
  date: {
    type: Sequelize.DATE,
    validate: {
      isDate: validations.isDate(),
    },
  },
  accepted: {
    type: Sequelize.BOOLEAN,
    validate: {
      isBoolean: validations.isBoolean(),
    },
  },
  compensation: {
    type: Sequelize.DECIMAL,
    validate: {
      isFloat: validations.isFloat({min: 0}),
    },
  },
  contactEmail: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: validations.isEmail(),
    },
  },
  dancersRequested: {
    type: Sequelize.INTEGER,
    validate: {
      isInt: validations.isInt({min: 1}),
    },
  },
});
