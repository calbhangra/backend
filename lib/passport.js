import passport from 'passport';
import LocalStrategy from 'passport-local';

import models from '../models';
import password from './password';
import {AuthError} from './errors';

const User = models.User;

const authenticate = function(username, passphrase, done) {

  User
    .findOne({
      where: {email: username},
      attributes: {exclude: []},
    })
    .tap(user => { if (!user) throw new AuthError(); })
    .tap(user => password.verify(passphrase, user.password))
    .then(user => done(null, user))
    .catch(AuthError, err => done(null, false, err))
    .catch(err => done(err));
};

passport.use(new LocalStrategy(authenticate));

export default passport.authenticate('local', {session: false});
