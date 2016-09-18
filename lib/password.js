import _bcrypt from 'bcrypt';
import Promise from 'bluebird';

import {AuthError} from './errors';

const ROUNDS = 10;
const bcrypt = {
  compare: Promise.promisify(_bcrypt.compare),
  hash: Promise.promisify(_bcrypt.hash)
};

function verify(password, hash) {
  return bcrypt
    .compare(password, hash)
    .tap(isValid => { if (!isValid) throw new AuthError(); });
}

function hash(password) {
  return bcrypt.hash(password, ROUNDS);
}

export default {verify, hash};
