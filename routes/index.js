import {Router} from 'express';

const baseRouter = new Router();
const routes = ['gig', 'user', 'auth'];

baseRouter.get('/', (req, res) => {
  res.send('home page');
});

routes.forEach(route => {
  // eslint-disable-next-line global-require
  let router = require(`./${route}.router`);
  baseRouter.use(`/${route}`, router.default);
});

export default baseRouter;
