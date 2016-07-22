'use strict';

import express from 'express';
var router = express.Router(); // eslint-disable-line new-cap

router.get('/', function index(req, res) {
  res.send('home page');
});

export default router;
