import _ from 'lodash';

import {PermissionError} from '../lib/errors';

const roles = {
  user: [],
  admin: [
    'user.*',
  ],
};

function checker(whitelist, req) {

  const role = req.role;
  const permissions = roles[role];

  if (_.intersection(permissions, whitelist)) {
    return Promise.resolve();
  }

  // there needs to be a better way to allow this functionality
  if (req.params.id && whitelist.includes('user.self')
  && req.userId === req.params.id) {
    return Promise.resolve();
  }

  return Promise.reject(new PermissionError());

}

function middleware(whitelist) {

  return function(req, res, next) {
    return checker(whitelist, req)
      .then(() => next())
      .catch(err => next(err));
  };
}

export {checker, middleware};
