import {Router} from 'express';

import models from '../models';
import promise from './promise';
import {NotFoundError, ServerError} from '../lib/errors';

const Gig = models.Gig;
const router = new Router();

// TODO add permission checks to all routes except create

router.get('/', promise(() => {
  return Gig.findAll();
}));

router.post('/', promise(req => {
  return Gig.create(req.body);
}));

router.get('/:id', promise(req => {
  return Gig.findById(req.params.id);
}));

router.put('/:id', promise(req => {

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

router.delete('/:id', promise(req => {
  // TODO log username and metadata into seperate log file

  return Gig
    .destroy({where: {id: req.params.id}})
    .then(count => { if (count !== 1) throw new ServerError(); });
}));

export default router;
