import {Router} from 'express';

import {Gig} from '../models';
import promisify from '../lib/promisify';
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
      // istanbul ignore next
      if (count !== 1) throw new ServerError();
      return records[0];
    });
}));

router.delete('/:id', async (req, res, next) => {
  // TODO log username and metadata into seperate log file

  try {

    const count = await Gig.destroy({where: {id: req.params.id}});

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
