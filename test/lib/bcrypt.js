import test from 'ava';

import bcrypt from '../../lib/bcrypt';
import {AuthError} from '../../lib/errors';

test('hash works', async t => {
  const hash = await bcrypt.hash('pass');
  t.not(hash, 'pass');
});

test('verify works', async t => {
  const hash = await bcrypt.hash('pass', 10);
  const result = await bcrypt.verify('pass', hash);
  t.true(result);
});

test('verify throws AuthError for invalid password', t => {
  t.throws(bcrypt.verify('pass', 'not a hash'), AuthError);
});
