'use strict';

import express from 'express';
const baseRouter = express.Router(); // eslint-disable-line new-cap
const routes = ['gig', 'user', 'auth'];

baseRouter.get('/', function index(req, res) {
  res.send('home page');
});

var router;
routes.forEach(route => {
  router = require(`./${route}.router`);
  baseRouter.use(`/${route}`, router.default);
});

export default baseRouter;
