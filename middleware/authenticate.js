import jwt from '../lib/jwt';
import {User} from '../models';
import bcrypt from '../lib/bcrypt';
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
    .then(createToken)
    .then(token => res.json({token}))
    .catch(next);
}

export function createToken(user) {
  return jwt.create({
    sub: user.id,
    roles: ['user'],
  });
}

export default {
  jwt: jwtAuth,
  password: passwordAuth,
  createToken,
};
