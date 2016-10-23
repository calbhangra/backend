import jwt from '../lib/jwt';
import {User} from '../models';
import bcrypt from '../lib/bcrypt';
import {AuthError, InvalidRequestError} from '../lib/errors';

export function jwtAuth(req, res, next) {
  const token = req.get('authorization');

  if (!token) {
    const message = 'JWT must be provided in the Authorization header';
    return next(new AuthError(message));
  }

  try {
    var payload = jwt.verify(token);
  } catch (e) {
    return next(e);
  }

  req.userId = payload.sub;
  req.roles = payload.roles;

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
    .tap(user => { if (!user) throw new AuthError(); })
    .tap(user => bcrypt.verify(req.body.password, user.password))
    .then(user => {

      let payload = {
        sub: user.id,
        roles: ['user'],
      };

      res.json({
        token: jwt.create(payload),
      });

    })
    .catch(next);
}

export default {
  jwt: jwtAuth,
  password: passwordAuth,
};
