'use strict';

var config = require('config');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var port = config.get('port');

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.listen(port, function startServer() {
  console.log('Example app listening on port', port);
});
