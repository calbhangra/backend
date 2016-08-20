'use strict';

import bcrypt from 'bcrypt';
import Promise from 'bluebird';

const ROUNDS = 10;
const createHash = Promise.promisify(bcrypt.hash);

var User = function model(sequelize, DataTypes) {

  return sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
  }, {
    hooks: {
      afterValidate: function(user) {
        if (!user.changed('password')) {
          return;
        }

        return createHash(user.password, ROUNDS)
           .then(hash => user.password = hash);
     },
    }
  });

};

export default User;
