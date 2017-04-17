import bcrypt from 'bcrypt';
import Sequelize from 'sequelize';

import database from '../lib/db';
import validations from './validations';

export default database.define('User', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: validations.isEmail(),
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
}, {
  hooks: {
    afterValidate: function(user) {
      if (!user.changed('password')) {
        return;
      }

      return bcrypt
        .hash(user.password, 10)
        .then(hash => (user.password = hash));
    },
  },
});
