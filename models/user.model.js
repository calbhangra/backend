import bcrypt from 'bcrypt';
import Sequelize from 'sequelize';

import {postgres} from '../lib/db';

export default postgres.define('User', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
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
