'use strict';

var express = require('express');
var router = express.Router(); // eslint-disable-line new-cap
var restRouter = require('./rest_router');
var controllers = require('../controllers');

// define the home page route
router.get('/', function index(req, res) {
  res.send('home page');
});

router.get('/gig', restRouter(controllers.gig));

module.exports = router;
