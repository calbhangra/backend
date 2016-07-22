'use strict';

import cors from 'cors';
import config from 'config';
import express from 'express';
import {postgres} from './db';
import bodyParser from 'body-parser';

var app = express();
var port = config.get('port');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Start sequelize and then app
postgres.sync().then(function() {
  app.listen(port, function startServer() {
    console.log('Example app listening on port', port);
  });
});

export default app;
