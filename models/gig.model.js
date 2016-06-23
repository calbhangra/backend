var Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'username', 'password');
// TODO move database connection elsewhere

// TODO verify format of sequelize types
// TODO should number of dancers be broken down by gender?
var Gig = sequelize.define('gig', {
  date: Sequelize.DATE,
  accepted: Sequelize.BOOLEAN,
  compensation: Sequelize.NUMBER,
  contactEmail: Sequelize.EMAIL,
  dancersRequested: Sequelize.NUMBER,
})