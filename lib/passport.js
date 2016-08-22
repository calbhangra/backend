'use strict';

import bcrypt from 'bcrypt';
import Promise from 'bluebird';
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

import models from '../models';
import {AuthError} from './errors';

const User = models.User;

// TODO move this into helper file
const verifyPass = function(password, hash) {
  return Promise
    .promisify(bcrypt.compare)(password, hash)
    .then(isValid => {
      if(!isValid) {
        throw new AuthError();
      }
    });
};

const authenticate = function(username, password, done) {

  var isValidPass = false;

  User
    .findOne({
      where: {email: username},
      attributes: {exclude: []},
     })
    .tap(user => {
      if (!user) {
        throw new AuthError();
      }
    })
    .tap(user => verifyPass(password, user.password))
    .then(user => done(null, user))
    .catch(AuthError, err => done(null, false))
    .catch(err => done(err));
};

passport.use(new LocalStrategy(authenticate));

export default passport.authenticate('local', {session: false});
