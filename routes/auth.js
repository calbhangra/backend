import {Router} from 'express';

import {User} from '../models';
import promisify from '../lib/promisify';
import authenticate from '../middleware/authenticate';

const router = new Router();

router.post('/login', authenticate.password);

router.post('/signup', promisify(req => {
  return User
    .create(req.body)
    .then(authenticate.createToken)
    .then(token => ({token}));
}));

export default router;
