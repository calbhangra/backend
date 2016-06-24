var setupModels = function(sequelize) {
  // Here we will explicitly import all the models we care about and set them up
  [
    'gig'
  ].forEach(function(model) {
    require('./' + model + '.model')(sequelize);
  });
};

module.exports = setupModels;
