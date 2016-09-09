import {Router} from 'express';

import auth from '../lib/passport';

const router = new Router();

router.post('/login', auth, (req, res) => {
  res.send('authed!');
});

router.post('/signup', (req, res) => {
 // TODO create user
  res.sendStatus(501);
});

export default router;
