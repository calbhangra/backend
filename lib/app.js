import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import {postgres} from './db';
import config from '../config';
import routes from '../routes';

const app = express();
const port = config.get('port');

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(routes);

// Start sequelize and then app
postgres.sync().then(function() {
  app.listen(port, function startServer() {
    // eslint-disable-next-line no-console
    console.log('Example app listening on port', port);
  });
});

export default app;
