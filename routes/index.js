import {Router} from 'express';

const baseRouter = new Router();
const routes = ['gig', 'user', 'auth'];

baseRouter.get('/', (req, res) => {
  res.send('home page');
});

var router;
routes.forEach(route => {
  router = require(`./${route}.router`);
  baseRouter.use(`/${route}`, router.default);
});

export default baseRouter;
