
module.exports = function(prefix, app, sequelize) {
  var model = sequelize[prefix];

  app.get('/' + prefix, (req, res) => {
    // TODO
    // 1. determine if req for one object or multiple
    // 2. check user permissions
    // 3. request object(s) from the model
    model
      .findAll()
      .then(data => res.send(data));
  });

  app.post('/' + prefix, (req, res) => {
    // TODO
    // 1. validate incoming data
    // 2. send validated to model for creation
    model
      .create(req.body)
      .then(data => res.send(data));
  });

  app.put('/' + prefix, (req, res) => {
    // TODO
    // 1. validate incoming data
    // 2. check user's permissions
    // 3. send validated data to model for update
    // eslint-disable-next-line no-magic-numbers
    res.sendStatus(500);
  });

  app.delete('/' + prefix, (req, res) => {
    // TODO
    // 1. check user permissions
    // 2. log username and metadata into seperate log file
    // 3. send deletion request to model
    // eslint-disable-next-line no-magic-numbers
    res.sendStatus(500);
  });
};
