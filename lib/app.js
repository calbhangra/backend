'use strict';

// 3rd Party Libs
var cors = require('cors');
var config = require('config');
var express = require('express');
var Sequelize = require('sequelize');
var bodyParser = require('body-parser');

// Our Libs
var setupModels = require('../models');
var setupRoutes = require('../routes');

// Config
var port = config.get('port');
var postgres = config.get('postgres');

var app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

var sequelize = new Sequelize(
  postgres.database,
  postgres.username,
  postgres.password,
  {
    dialect: 'postgres'
  }
);


setupModels(sequelize);
setupRoutes(app, sequelize);

app.listen(port, function startServer() {
  console.log('Example app listening on port', port);
});
