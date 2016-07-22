'use strict';

import express from 'express';
import {Gig} from '../models';

var router = express.Router(); // eslint-disable-line new-cap
var route = router.route('/gig');

route.get('/', (req, res) => {
  // TODO
  // 1. determine if req for one object or multiple
  // 2. check user permissions
  // 3. request object(s) from the model
  Gig.findAll()
    .then(data => res.send(data));
});

route.post('/', (req, res) => {
  // TODO
  // 1. validate incoming data
  // 2. send validated to model for creation
  Gig.create(req.body)
    .then(data => res.send(data));
});

route.put('/:gigId', (req, res) => {
  // TODO
  // 1. validate incoming data
  // 2. check user's permissions
  // 3. send validated data to model for update
  // eslint-disable-next-line no-magic-numbers
  res.sendStatus(500);
});

route.delete('/:gigId', (req, res) => {
  // TODO
  // 1. check user permissions
  // 2. log username and metadata into seperate log file
  // 3. send deletion request to model
  // eslint-disable-next-line no-magic-numbers
  res.sendStatus(500);
});

export default router;
