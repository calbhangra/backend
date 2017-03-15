import bcrypt from 'bcrypt';

import jwt from '../lib/jwt';
import {User} from '../models';
import {AuthError, InvalidRequestError} from '../lib/errors';

export function jwtAuth(req, res, next) {
  const token = req.get('authorization');

  if (!token) {
    const message = 'JWT must be provided in the Authorization header';
    return next(new InvalidRequestError(message));
  }

  try {
    var payload = jwt.verify(token);
  } catch (e) {
    return next(e);
  }

  req.userId = payload.sub;
  req.role = payload.role;

  return next();
}

export function passwordAuth(req, res, next) {

  if (!req.body || !req.body.email || !req.body.password) {
    return next(new InvalidRequestError());
  }

  return User
    .findOne({
      where: {email: req.body.email},
      attributes: {exclude: []},
    })
    .tap(async user => {

      if (!user) {
        throw new AuthError();
      }

      const valid = await bcrypt.compare(req.body.password, user.password);

      if (!valid) {
        throw new AuthError();
      }

    })
    .then(createToken)
    .then(token => res.json({token}))
    .catch(next);
}

export function createToken(user) {
  return jwt.create({
    sub: user.id,
    role: ['user'],
  });
}

export default {
  jwt: jwtAuth,
  password: passwordAuth,
  createToken,
};
