
module.exports = function(prefix, app, sequelize) {
  var model = sequelize[prefix];

  app.get('/' + prefix, function(req, res) {
    // TODO
    // 1. validate incoming data
    // 2. send validated to model for creation 
    res.send('sample get response for model: ' + model);
  });

  app.post('/' + prefix, function(req, res) {
    // TODO
    // 1. determine if req for one object or multiple
    // 2. check user permissions 
    // 3. request object(s) from the model 
  });

  app.put('/' + prefix, function(req, res) {
    // TODO
    // 1. validate incoming data
    // 2. check user's permissions
    // 3. send validated data to model for update
  });

  app.delete('/' + prefix, function(req, res) {
    // TODO
    // 1. check user permissions
    // 2. log username and metadata into seperate log file
    // 3. send deletion request to model
  });
};
