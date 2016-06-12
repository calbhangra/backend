'use strict';

const router = require('express').router();

router.get('/', (req, res) => {
  res.send('list all gigs');
});

router.post('/', (req, res) => {
  res.send('create a new gig');
});

router.get('/:id', (req, res) => {
  res.send('gig with id#');
});

router.put('/:id', (req, res) => {
  res.send('update gig with id#');
});

router.delete('/:id', (req, res) => {
  res.send('delete gig with id#');
});

router.param('id', (req, res, next, id) => {
  req.gig = 'get gig from db';
  next();
});

export default router;