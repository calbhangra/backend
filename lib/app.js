import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import database from './db';
import config from '../config';
import routes from '../routes';
import errorHandler from '../middleware/error_handler';

const app = express();
const port = config.get('port');

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(routes);
app.use(errorHandler);

// Start sequelize and then app
database.sync().then(function() {
  app.listen(port, function startServer() {
    // eslint-disable-next-line no-console
    console.log('Example app listening on port', port);
  });
});

export default app;
