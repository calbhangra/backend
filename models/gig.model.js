'use strict';

var Gig = function model(sequelize, DataTypes) {

  return sequelize.define('Gig', {
    date: DataTypes.DATE,
    accepted: DataTypes.BOOLEAN,
    compensation: DataTypes.DOUBLE,
    contactEmail: DataTypes.STRING,
    dancersRequested: DataTypes.INTEGER,
  });

};

export default Gig;
