import test from 'ava';

import password from '../../lib/password';
import {AuthError} from '../../lib/errors';

test('hash works', async t => {
  const hash = await password.hash('pass');
  t.not(hash, 'pass');
});

test('verify works', async t => {
  const hash = await password.hash('pass', 10);
  const result = await password.verify('pass', hash);
  t.true(result);
});

test('verify throws AuthError for invalid password', t => {
  t.throws(password.verify('pass', 'not a hash'), AuthError);
});
