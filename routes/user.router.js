import _ from 'lodash';
import {Router} from 'express';

import models from '../models';
import promisify from './promisify';
import {NotFoundError, ServerError} from '../lib/errors';

const User = models.User;
const router = new Router();

// TODO add permission checks to all routes except create

router.get('/', promisify(() => {
  return User.findAll();
}));

router.post('/', promisify(req => {
  return User.create(req.body);
}));

router.get('/:id', promisify(req => {
  return User.findById(req.params.id);
}));

router.put('/:id', promisify(req => {
  var fields = Object.keys(req.body);
  fields = _.without(fields, 'password');

  return User
    .update(req.body, {
      where: {id: req.params.id},
      returning: true,
      fields: fields,
    })
    .spread((count, records) => {
      if (count !== 1) throw new ServerError();
      return records[0];
    });
}));

router.delete('/:id', promisify(req => {
  // TODO log username and metadata into seperate log file

  return User
    .destroy({where: {id: req.params.id}})
    .then(count => { if (count !== 1) throw new ServerError(); });
}));

export default router;
