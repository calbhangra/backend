'use strict';

var config = require('config');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();


// Middleware
app.use(bodyParser.json());
app.use(cors());

var port = config.get('port');
app.listen(port, function() {
  console.log('Example app listening on port', port);
});