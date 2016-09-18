import Sequelize from 'sequelize';

import {postgres} from '../lib/db';
import password from '../lib/password';

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

      return password.hash(user.password)
           .then(hash => (user.password = hash));
    },
  },
});
