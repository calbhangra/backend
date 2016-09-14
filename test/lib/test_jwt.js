import test from 'ava';
import config from 'config';
import jwt from '../../lib/jwt';

const algo = config.get('jwt.algorithm');
const secret = Buffer.from(config.get('jwt.secret'), 'base64');

test('key length matches hash length of algorithm', t => {
  const hashLengthInBytes = algo.substring(2) / 8;
  t.is(secret.toString('ascii').length, hashLengthInBytes);
});

test('create', t => {
  return jwt.create({nbf: 'not a number'})
    .then(() => t.fail('bad data should throw error'))
    .catch(jwt.JsonWebTokenError, () => t.pass());
});
