import password from '../lib/password';

const User = function model(sequelize, DataTypes) {

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

        return password.hash(user.password)
           .then(hash => user.password = hash);
      },
    }
  });

};

export default User;
