'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();


// Middleware
app.use(bodyParser.json());
app.use(cors());