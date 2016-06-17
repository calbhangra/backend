'use strict';

var express = require('express');
var router = express.Router(); // eslint-disable-line new-cap

// define the home page route
router.get('/', function index(req, res) {
  res.send('home page');
});

module.exports = router;
