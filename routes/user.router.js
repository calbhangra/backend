import _ from 'lodash';
import {Router} from 'express';

import models from '../models';
import promise from './promise';
import {ServerError, NotFoundError} from '../lib/errors';

const User = models.User;
const router = new Router();

// TODO add permission checks to all routes except create

router.get('/', promise(() => {
  return User.findAll();
}));

router.post('/', promise(req => {
  return User.create(req.body);
}));

router.get('/:id', promise(req => {

  return User
    .findById(req.params.id)
    .tap(user => { if (!user) throw new NotFoundError(); });
}));

router.put('/:id', promise(req => {
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

router.delete('/:id', promise(req => {
  // TODO log username and metadata into seperate log file

  return User
    .destroy({where: {id: req.params.id}})
    .then(count => { if (count !== 1) throw new ServerError(); });
}));

export default router;
