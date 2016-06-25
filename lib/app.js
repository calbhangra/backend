'use strict';

var config = require('config');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var port = config.get('port');

var Sequelize = require('sequelize');

var setupModels = require('../models');
var setupRoutes = require('../routes');

var app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// TODO replace definition with this once we have a db:
// var sequelize = new Sequelize('database', 'username', 'password');
// use dummy for now
var sequelize = {
  define: function() {},
};

setupModels(sequelize);

setupRoutes(app, sequelize);

app.listen(port, function startServer() {
  console.log('Example app listening on port', port);
});
