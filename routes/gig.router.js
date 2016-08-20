'use strict';

import express from 'express';
import models from '../models';
import {ValidationError} from 'sequelize';

var Gig = models.Gig;
var router = express.Router(); // eslint-disable-line new-cap

// TODO add permission checks to all routes except create
// TODO handle all validation errors in one place

router.get('/', (req, res) => {

  Gig.findAll()
    .then(data => res.send(data));
});

router.post('/', (req, res) => {

  Gig.create(req.body)
    .then(data => res.send(data))
    .catch(ValidationError, err => {
      res.status(400).send(err.errors[0]);
     })
});

router.get('/:id', (req, res) => {

  Gig.findById(req.params.id)
    .then(gig => res.send(gig));
});

router.put('/:id', (req, res) => {

  Gig.update(req.body, {
      where: {id: req.params.id},
      returning: true,
     })
    .then(([count, records])=> {
      if (count !== 1) {
        // TODO throw error instead
        res.sendStatus(500);
      }

      res.send(records[0]);
     })
    .catch(ValidationError, err => {
      res.status(400).send(err.errors[0]);
     })
});

router.delete('/:id', (req, res) => {
  // TODO log username and metadata into seperate log file

  Gig.destroy({where: {id: req.params.id}})
    .then(count => {
      var status = count === 1 ? 200 : 500;
      res.sendStatus(status);
    });
});

export default router;
