import {Router} from 'express';

import {Gig} from '../models';
import promisify from './promisify';
import {ServerError} from '../lib/errors';

const router = new Router();

// TODO add permission checks to all routes except create

router.get('/', promisify(() => {
  return Gig.findAll();
}));

router.post('/', promisify(req => {
  return Gig.create(req.body);
}));

router.get('/:id', promisify(req => {
  return Gig.findById(req.params.id);
}));

router.put('/:id', promisify(req => {

  return Gig
    .update(req.body, {
      where: {id: req.params.id},
      returning: true,
    })
    .spread((count, records) => {
      if (count !== 1) throw new ServerError();
      return records[0];
    });
}));

router.delete('/:id', promisify(req => {
  // TODO log username and metadata into seperate log file

  return Gig
    .destroy({where: {id: req.params.id}})
    .then(count => { if (count !== 1) throw new ServerError(); });
}));

export default router;
