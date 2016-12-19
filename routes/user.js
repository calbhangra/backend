import _ from 'lodash';
import {Router} from 'express';

import {User} from '../models';
import promisify from '../lib/promisify';
import {ServerError} from '../lib/errors';
import permission from '../middleware/permissions';
import authenticate from '../middleware/authenticate';

const router = new Router();

router.use(authenticate.jwt);

router.get('/',
  permission.check('user.list'),
  promisify(() => {
    return User.findAll();
  }));

router.get('/:id',
  permission.check(['user.self', 'user.get']),
  promisify(req => {
    return User.findById(req.params.id);
  }));

router.put('/:id',
  permission.check(['user.self', 'user.modify']),
  promisify(req => {
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

router.delete('/:id',
  permission.check(['user.self', 'user.delete']),
  async (req, res, next) => {
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
