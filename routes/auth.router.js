import {Router} from 'express';

import authenticate from '../middleware/authenticate';

const router = new Router();

router.post('/login', authenticate.password);

router.post('/signup', (req, res) => {
 // TODO create user
  res.sendStatus(501);
});

export default router;
