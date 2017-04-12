import _ from 'lodash';
import {Router} from 'express';

import {User} from '../models';
import promisify from '../lib/promisify';
import {ServerError} from '../lib/errors';

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
      fields,
    })
    .spread((count, records) => {
      // istanbul ignore next
      if (count !== 1) throw new ServerError();
      return records[0];
    });
}));

router.delete('/:id', async (req, res, next) => {
  // TODO log username and metadata into seperate log file

  try {

    const count = await User.destroy({where: {id: req.params.id}});

    // istanbul ignore next
    if (count !== 1) {
      throw new ServerError();
    }

    res.status(204).end();

  } catch (e) {
    // istanbul ignore next
    return next(e);
  }

});

export default router;
