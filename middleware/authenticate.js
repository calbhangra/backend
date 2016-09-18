import jwt from '../lib/jwt';
import {User} from '../models';
import bcrypt from '../lib/bcrypt';
import {AuthError, InvalidRequestError} from '../lib/errors';

export function passwordAuth(req, res, next) {

  if (!req.body.email || !req.body.password) {
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

      res.json(jwt.create(payload));
    })
    .catch(next);
}

export default {
  password: passwordAuth,
};
