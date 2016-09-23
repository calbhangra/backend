import {Router} from 'express';

import jwt from '../lib/jwt';
import {User} from '../models';
import promisify from './promisify';
import authenticate from '../middleware/authenticate';

const router = new Router();

router.post('/login', authenticate.password);

router.post('/signup', promisify(req => {

  return User
    .create(req.body)
    .then(user => {
      let payload = {
        sub: user.id,
        roles: ['user'],
      };

      return {
        token: jwt.create(payload),
      };

    });
}));

export default router;
