'use strict';

import fs from 'fs';
import path from 'path';
import {postgres} from '../lib/db';

var models = {};
var basename = path.basename(module.filename);

fs.readdirSync(__dirname)
  .filter(function(file) { // eslint-disable-next-line no-magic-numbers, max-len
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = postgres.import(path.join(__dirname, file));
    models[model.name] = model;
  });

Object.keys(models).forEach(function(modelName) {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export default models;
