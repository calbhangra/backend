'use strict';

var Gig = function model(sequelize, DataTypes) {

  return sequelize.define('Gig', {
    date: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      }
    },
    accepted: {
      type: DataTypes.BOOLEAN,
      validate: {
        isBoolean: true,
       },
    },
    compensation: {
      type: DataTypes.DOUBLE,
      validate: {
        isNumeric: true,
      },
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    dancersRequested: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true,
      },
    },
  });

};

export default Gig;
