'use strict';

import _ from 'lodash';
import express from 'express';
import models from '../models';
import {ValidationError} from 'sequelize';

const User = models.User;
const router = express.Router(); // eslint-disable-line new-cap

// TODO add permission checks to all routes except create
// TODO handle all validation errors in one place

router.get('/', (req, res) => {

  User.findAll()
    .then(data => res.send(data));
});

router.post('/', (req, res) => {

  User.create(req.body)
    .then(data => res.send(data))
    .catch(ValidationError, err => {
      res.status(400).send(err.errors[0]);
     })
});

router.get('/:id', (req, res) => {

  User.findById(req.params.id)
    .then(gig => res.send(gig));
});

router.put('/:id', (req, res) => {
  var fields = Object.keys(req.body);
  fields = _.without(fields, 'password');

  User.update(req.body, {
      where: {id: req.params.id},
      returning: true,
      fields: fields,
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

  User.destroy({where: {id: req.params.id}})
    .then(count => {
      var status = count === 1 ? 200 : 500;
      res.sendStatus(status);
    });
});

export default router;
