'use strict';

import express from 'express';
var baseRouter = express.Router(); // eslint-disable-line new-cap
var routes = ['gig', 'user'];

baseRouter.get('/', function index(req, res) {
  res.send('home page');
});

var router;
routes.forEach(route => {
  router = require(`./${route}.router`);
  baseRouter.use(`/${route}`, router.default);
});

export default baseRouter;
