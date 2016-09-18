import test from 'ava';
import config from 'config';
import jwt from '../../lib/jwt';

const algo = config.get('jwt.algorithm');
const secret = Buffer.from(config.get('jwt.secret'), 'base64');

test('key length matches hash length of algorithm', t => {
  const hashLengthInBytes = algo.substring(2) / 8;
  t.is(secret.toString('ascii').length, hashLengthInBytes);
});

test('create works', t => {
  const token = jwt.decode(jwt.create({
    sub: 'override',
    foo: 'blue',
  }));

  t.is(typeof token.iat, 'number');
  t.is(typeof token.nbf, 'number');
  t.is(token.iat, token.nbf);
  t.is(token.foo, 'blue');
});

test('create wraps any jwt.sign errors into JsonWebTokenErrors', t => {
  t.plan(2);

  try {
    jwt.create('not an object');
  } catch (e) {
    t.true(e instanceof jwt.JsonWebTokenError);
    t.is(e.name, 'JsonWebTokenError');
  }
});

test('create sets expiration to 6 hours', t => {
  const token = jwt.decode(jwt.create());
  const SIX_HOURS = 60 * 60 * 6;

  // division by 1000 to normalize to seconds
  t.is(token.exp, Math.floor(new Date() / 1000) + SIX_HOURS);
});

test('verify works', t => {
  const body = {sub: 'test', pub: 'pizza'};
  const decoded = jwt.verify(jwt.create(body));

  t.is(decoded.pub, body.pub);
  t.is(decoded.sub, body.sub);
});

test('verify for custom options', t => {
  t.plan(1);

  try {
    jwt.verify(jwt.create(), {algorithms: ['garbage']});
  } catch (e) {
    t.true(e instanceof jwt.JsonWebTokenError);
  }
});
