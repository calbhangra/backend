var Sequelize = require('sequelize');

module.exports = function(sequelize) {
  // TODO should number of dancers be broken down by gender?
  var Gig = sequelize.define('gig', {
    date: Sequelize.DATE,
    accepted: Sequelize.BOOLEAN,
    compensation: Sequelize.DOUBLE,
    contactEmail: Sequelize.STRING,
    dancersRequested: Sequelize.INTEGER
  });

  // TODO this shouldnt be here
  Gig.sync();
  sequelize.gig = Gig;
};
