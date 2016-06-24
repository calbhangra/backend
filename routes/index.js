var setupRoutes = function(app, sequelize) {
  // define the home page route
  app.get('/', function index(req, res) {
    res.send('home page');
  });

  // Here we will explicitly import all the routes we care about and set them up
  [
    'gig'
  ].forEach(function(route) {
    require('./' + route + '.router')(route, app, sequelize);
  });
};

module.exports = setupRoutes;
