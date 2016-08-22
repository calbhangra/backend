'use strict';

import cors from 'cors';
import config from 'config';
import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';

import {postgres} from './db';
import routes from '../routes';

const app = express();
const port = config.get('port');

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(routes);
app.use(passport.initialize());

// Start sequelize and then app
postgres.sync().then(function() {
  app.listen(port, function startServer() {
    console.log('Example app listening on port', port);
  });
});

export default app;
