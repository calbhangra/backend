var GigController = {};
var model = require('../models/gig.model.js');

GigController.create = function(req, res) {
  // TODO
  // 1. validate incoming data
  // 2. send validated to model for creation 
}

GigController.get = function(req, res) {
  // TODO
  // 1. determine if req for one object or multiple
  // 2. check user permissions 
  // 3. request object(s) from the model 
}

GigController.update = function(req, res) {
  // TODO
  // 1. validate incoming data
  // 2. check user's permissions
  // 3. send validated data to model for update
}

GigController.del = function(req, res) {
  // TODO
  // 1. check user permissions
  // 2. log username and metadata into seperate log file
  // 3. send deletion request to model
}

export default GigController;