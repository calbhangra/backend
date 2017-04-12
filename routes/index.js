/* eslint-disable global-require */
import fs from 'fs';
import path from 'path';
import {Router} from 'express';

const base = new Router();

base.get('/', (req, res) => res.send('home page'));

fs.readdirSync(__dirname)
  .filter(file => path.extname(file) === '.js' && file !== 'index.js')
  .forEach(file => {

    const router = require(path.join(__dirname, file)).default;
    const route = path.basename(file, path.extname(file));

    base.use(`/${route}`, router);

  });

base.use((req, res) => res.sendStatus(404));

export default base;
